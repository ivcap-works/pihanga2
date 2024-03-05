import type {
  DispatchF,
  PiRegister,
  ReduxAction,
  ReduxState,
} from "@pihanga2/core"
import type { RestErrorAction } from "@pihanga2/core"
import { ACTION_TYPES, BaseEvent, ErrorAction } from "./actions"
import { GetOAuthContext, OAuthContextT } from "./auth/common"

// export type Deployment = {
//   url: URL,
// }

// export const Deployments: { [k: string]: Deployment } = {}

export const CommonProps = (name: string) => ({
  name,
  context: () => GetOAuthContext(),
  origin: (_1: any, _2: any, ctxt: OAuthContextT) => ctxt.ivcapURL,
  headers: (_1: any, _2: any, ctxt: OAuthContextT) => ({ Authorization: `Bearer ${ctxt.token}` }),
  error: restErrorHandling(`ivcap-api:${name}`),
})

export function dispatchEvent<T, R extends BaseEvent<any>>(
  ev: T,
  type: string,
  dispatch: DispatchF,
  request: R,
): void {
  const a = request.mapper ? request.mapper(ev) : { type, ...ev }
  if (request.reqID && !("reqID" in a)) {
    // eslint-disable-next-line prettier/prettier
    (a as any).reqID = request.reqID // forcing reqID onto action
  }
  dispatch(a)
}

export function restErrorHandling<A>(source: string) {
  return (
    state: ReduxState,
    action: RestErrorAction<A>,
    requestAction: A,
    dispatch: DispatchF,
  ): ReduxState => {
    const code = action.statusCode
    if (code === 401) {
      dispatch({
        type: ACTION_TYPES.NOT_AUTHORIZED,
        message: "Not authorized",
        source,
        cause: action,
        requestAction,
      } as ErrorAction)
    } else {
      dispatch({
        type: ACTION_TYPES.ERROR,
        message: `${action.content?.error || "error"}`,
        source,
        cause: action,
        requestAction,
      } as ErrorAction)
    }
    return state
  }
}

export function createListUrlBuilder(
  service: string,
  extend?: { [k: string]: string },
): string {
  let q = Object.entries({
    limit: "limit",
    page: "page",
    filter: "filter",
    "order-by": "orderBy",
    "order-desc": "orderDesc",
    "at-time": "atTime",
  }).map(([k, v]) => `${k}=?${v}`)
  if (extend) {
    const q2 = Object.entries(extend).map(([k, v]) => `${k}=?${v}`)
    q = q.concat(q2)
  }
  const u = `/1/${service}?${q.join("&")}`
  return u
}

export type Links = {
  self: string
  first: string
  next?: string
}

export function getNextPage(links: Links): string | undefined {
  if (links.next) {
    return links.next.split("?page=")[1]
  }
  return undefined
}

// PROMISE API

export type RequestEvent = { reqID?: string }

export type ReduceF<S extends ReduxState, E extends RequestEvent> = (
  state: S,
  event: E,
  dispatch: DispatchF,
) => S
export type ThenF<E extends RequestEvent> = (event: E) => void

export type ThenP<S extends ReduxState, E extends RequestEvent> = (
  f: ThenF<E>,
) => PromiseT<S, E>

export type ReduceP<S extends ReduxState, E extends RequestEvent> = (
  r: ReduceF<S, E>,
) => PromiseT<S, E>

export type PromiseT<S extends ReduxState, E extends { reqID?: string }> = {
  reduce: ReduceP<S, E>
  then: ThenP<S, E>
}

export type PropT<P> = Omit<P, keyof BaseEvent>

export function getPromise<S extends ReduxState, E extends { reqID?: string }>(
  resultAction: string,
  register: PiRegister,
  reqID: string,
): PromiseT<S, E> {
  let thenF: ThenF<E> | undefined
  let reduceF: ReduceF<S, E> | undefined

  register.reducer.registerOneShot<S, ReduxAction & E>(
    resultAction,
    (s, a, d) => {
      if (a.reqID !== reqID) return [s, false]

      if (reduceF) {
        return [reduceF(s, a, d), true]
      }
      if (thenF) {
        thenF(a)
      }
      return [s, false]
    },
  )
  const res: PromiseT<S, E> = {
    then: (f) => {
      thenF = f
      return res
    },
    reduce: (f) => {
      reduceF = f
      return res
    },
  }
  return res
}
