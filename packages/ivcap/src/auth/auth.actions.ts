import { DispatchF, ReduxState, createOnAction, registerActions } from "@pihanga2/core";
import { PiReducer, ReduceF, ReduxAction } from "@pihanga2/core";

export const IVCAP_AUTH_ACTION = registerActions("ivcap/auth", [
  "provider",
  "login_to_provider",
  "logout",
  "user_info",
  "user_info_error",
  "error"
])

//======== provider

export type OAuthProviderEvent = {
  id: string
  name: string
  ivcapURL: string
}

export const onOAuthProvider = createOnAction<OAuthProviderEvent>(
  IVCAP_AUTH_ACTION.PROVIDER,
)

export function dispatchIvcapOAuthProvider(
  ev: OAuthProviderEvent,
  dispatch: DispatchF,
): void {
  dispatch({ type: IVCAP_AUTH_ACTION.PROVIDER, ...ev })
}

//======== login_to_provider

export type OAuthLoginRequestEvent = {
  providerID: string
  ivcapURL: string
}

export function dispatchIvcapOAuthLoginRequest(
  ev: OAuthLoginRequestEvent,
  dispatch: DispatchF,
): void {
  dispatch({ type: IVCAP_AUTH_ACTION.LOGIN_TO_PROVIDER, ...ev })
}

export function onIvcapOAuthLoginRequest<S extends ReduxState>(
  reducer: PiReducer,
  f: ReduceF<S, ReduxAction & OAuthLoginRequestEvent>
) {
  reducer.register<S, ReduxAction & OAuthLoginRequestEvent>(IVCAP_AUTH_ACTION.LOGIN_TO_PROVIDER, f)
}

//======== logout

export function dispatchIvcapLogout(
  dispatch: DispatchF,
): void {
  dispatch({ type: IVCAP_AUTH_ACTION.LOGOUT })
}

export function onIvcapLogout<S extends ReduxState>(
  reducer: PiReducer,
  f: ReduceF<S, ReduxAction>
) {
  reducer.register<S, ReduxAction>(IVCAP_AUTH_ACTION.LOGOUT, f)
}


//======== user_info

export type UserInfoEvent = {
  name: string
  nickName?: string
  email?: string
  picture?: string
  acountID?: string
}

export function dispatchIvcapUserInfo(
  ev: UserInfoEvent,
  dispatch: DispatchF,
): void {
  dispatch({ type: IVCAP_AUTH_ACTION.USER_INFO, ...ev })
}

export function onIvcapUserInfo<S extends ReduxState>(
  reducer: PiReducer,
  f: ReduceF<S, ReduxAction & UserInfoEvent>
) {
  reducer.register<S, ReduxAction & UserInfoEvent>(IVCAP_AUTH_ACTION.USER_INFO, f)
}
//======== error

export function dispatchIvcapAuthError(
  error: string,
  context: string,
  dispatch: DispatchF,
): void {
  dispatch({ type: IVCAP_AUTH_ACTION.ERROR, error, context })
}