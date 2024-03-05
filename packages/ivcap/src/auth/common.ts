import { PiRegister } from "@pihanga2/core";
import { load as yamlLoad } from "js-yaml";
import { dispatchIvcapAuthError, dispatchIvcapOAuthProvider } from "./auth.actions";
import { auth0Init } from "./auth0";
import { PiReducer } from "@pihanga2/core/dist/types";

export type OAuthProviders = {
  deployment: string // url
  defProvider: string
  providers: { [name: string]: OAuthProvider }
}

export type OAuthProvider = {
  name: string
  ivcapURL: string
  domain: string
  audience: string
  clientID: string
}

export type OAuthContextT = {
  ivcapURL: string
  token: string
}

let authResolve: (value: OAuthContextT) => void
let authReject: (reason?: any) => void

let authContext = new Promise<OAuthContextT>((resolve, reject) => {
  authResolve = resolve
  authReject = reject
})

export function SetOAuthContext(ivcapURL: string, token: string) {
  authResolve({ ivcapURL, token })
}

export function ClearOAuthContext() {
  authReject("context cleared")
  authContext = new Promise<OAuthContextT>((resolve, reject) => {
    authResolve = resolve
    authReject = reject
  })
}

export function GetOAuthContext(): Promise<OAuthContextT> {
  return authContext
}

type HandlerF = (provider: OAuthProvider, reducer: PiReducer) => void
const handlers: { [k: string]: HandlerF } = {
  "auth0": auth0Init
}

type Deployment = {
  url: URL,
  providers?: OAuthProviders,
}

const Deployments: { [k: string]: Deployment } = {}
let isInitialized = false
let reducer: PiReducer

export function registerIvcapDeployment(url: globalThis.URL) {
  const k = url.toString()
  if (Deployments[k]) {
    return // ignore
  }
  const d: Deployment = { url }
  Deployments[k] = d
  if (isInitialized) {
    initDeployment(d)
  }
}

export function commonInit(register: PiRegister): void {
  reducer = register.reducer
  isInitialized = true
  for (let d of Object.values(Deployments)) {
    initDeployment(d)
  }
}

function initDeployment(d: Deployment) {
  if (!isInitialized) return

  getAuthInfo(d).then((ainfo) => {
    const providers = parseAuthInfo(ainfo, d)
    d.providers = providers
    for (let p of Object.values(providers.providers)) {
      const h = handlers[p.name]
      if (h) {
        h(p, reducer)
      }
      dispatchIvcapOAuthProvider({
        id: p.name,
        name: p.name[0].toUpperCase() + p.name.slice(1),
        ivcapURL: p.ivcapURL,
      }, reducer.dispatch)
    }
  })
}

function parseAuthInfo(ai: any, d: Deployment): OAuthProviders {
  if (ai.version !== 1) {
    throw Error("unknown 'authinfo' returned from deployment")
  }
  const defProvider = ai.auth["default-provider-id"]
  const providers: { [k: string]: OAuthProvider } = {}
  for (let [k, v] of (Object.entries(ai.auth.providers as { [k: string]: any }))) {
    providers[k] = {
      name: k,
      ivcapURL: d.url.toString(),
      clientID: v['client-id'],
      domain: v['domain'] || new URL(v['login-url']).hostname,
      audience: v['audience'] || d.url.toString(),
    }
  }
  if (!providers[defProvider]) {
    throw Error("unknown 'default provider' returned from deployment")
  }
  return { deployment: d.url.toString(), defProvider, providers }
}

function getAuthInfo(d: Deployment): Promise<any> {
  const url = new URL(d.url)
  url.pathname = "/1/authinfo.yaml"
  const ainfo = fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      return response.text()
    })
    .then(txt => {
      return yamlLoad(txt)
    })
    .catch(err => {
      dispatchIvcapAuthError(err, "while loading authinfo", reducer.dispatch)
    })

  return ainfo
}