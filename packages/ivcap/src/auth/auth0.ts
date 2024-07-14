import { Auth0Client, createAuth0Client } from '@auth0/auth0-spa-js';
import { PiReducer } from "@pihanga2/core/dist/types"
import { OAuthProvider, SetOAuthContext } from "./common";

import { IVCAP_AUTH_ACTION, UserInfoEvent, dispatchIvcapAuthError, dispatchIvcapUserInfo, onIvcapLogout, onIvcapOAuthLoginRequest } from "./auth.actions"

export function auth0Init(provider: OAuthProvider, reducer: PiReducer): void {

  const redirect = `${window.location.origin}/_auth0`
  const auth0P = createAuth0Client({
    domain: provider.domain,
    clientId: provider.clientID,
    cacheLocation: 'localstorage',
    authorizationParams: {
      redirect_uri: redirect,
      audience: provider.audience, // provider.ivcapURL, //"https://api.ivcap.net/",
    }
  })

  auth0P.then((auth0) => {
    auth0.getTokenSilently().then(token => {
      processToken(token, auth0, provider, reducer)
    }).catch(error => {
      if (error.error !== 'login_required') {
        dispatchIvcapAuthError(error, "while getting oauth token", reducer.dispatch)
        return
      }
    })

    auth0.handleRedirectCallback<string>().then((result) => {
      if (result.appState) {
        window.location.assign(result.appState)
      }
    }).catch(() => { }) // we don't care about errors
  })

  onIvcapOAuthLoginRequest(reducer, (state, { providerID }) => {
    if (providerID === "auth0") {
      const currentPage = state.route.url
      auth0P.then((auth0) => {
        auth0.loginWithRedirect({
          appState: currentPage
        }).catch(error => {
          dispatchIvcapAuthError(error, "while logging in with redirect", reducer.dispatch)
          return
        })
      })
    }
    return state
  })

  onIvcapLogout(reducer, (state) => {
    auth0P.then((auth0) => {
      auth0.logout({
        logoutParams: {
          returnTo: `${window.location.origin}/logout`,
        }
      })
    })
    return state
  })
}

function processToken(
  token: string,
  auth0: Auth0Client,
  provider: OAuthProvider,
  reducer: PiReducer
) {
  SetOAuthContext(provider.ivcapURL, token)
  auth0.getUser().then(u => {
    if (!u) {
      reducer.dispatch({ type: IVCAP_AUTH_ACTION.USER_INFO_ERROR })
      return
    }
    const e: UserInfoEvent = {
      name: u.name || 'anonymous',
      nickName: u.nickname,
      email: u.email,
      picture: u.picture,
      acountID: u.acc,
    }
    dispatchIvcapUserInfo(e, reducer.dispatchFromReducer)
  }).catch(error => {
    dispatchIvcapAuthError(error, "while getting user info", reducer.dispatch)
  })
}
