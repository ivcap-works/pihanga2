import { current } from "immer"
import { DispatchF, PiReducer, ReduxAction, ReduxState } from "../types"
import {
  ACTION_TYPES,
  Bindings,
  ContextErrorAction,
  ErrorAction,
  ErrorKind,
  HttpResponse,
  RegisterGenericProps,
  ResultAction,
} from "./types"

export function parseResponse(
  response: Response,
): Promise<[any, string, Response]> {
  const contentType = response.headers.get("content-type")
  if (contentType) {
    switch (contentType) {
      case "application/json":
        return response.json().then((j) => [j, contentType, response])
      case "application/jose":
        return response.text().then((t) => [t, contentType, response])
      default:
        if (contentType.startsWith("text")) {
          return response.text().then((t) => [t, contentType, response])
        }
    }
  }
  return response.blob().then((t) => [t, "unknown", response])
}

export function createErrorAction<R>(
  type: string,
  resp: HttpResponse,
  name: string,
  url: URL,
  request: R,
): ErrorAction<R> {
  let error: ErrorKind
  const status = resp.statusCode
  if (status === 401) {
    error = ErrorKind.Unauthorised
  } else if (status === 403) {
    error = ErrorKind.PermissionDenied
  } else if (status === 404) {
    error = ErrorKind.NotFound
  } else {
    error = ErrorKind.Other
  }
  return {
    type,
    requestID: name,
    error,
    url: url.toString(),
    request,
    ...resp,
  }
}

export type RequestF<S extends ReduxState, A extends ReduxAction> = (
  state: S,
  action: A,
) => [RequestInit, Bindings]

export function registerCommon<S extends ReduxState, A extends ReduxAction, R, C = any>(
  reducer: PiReducer,
  props: RegisterGenericProps<S, A, R, C>,
  requestF: RequestF<S, A>,
  submitType: string,
  resultType: string,
  errorType: string,
  intErrorType: string,
) {
  const {
    name,
    origin = window.location.href,
    url,
    trigger,
    context,
    guard,
    headers,
    reply,
    error,
  } = props

  if (!name) {
    throw Error('Missing "name"')
  }
  if (!url) {
    throw Error('Missing "url"')
  }
  if (!trigger) {
    throw Error('Missing "trigger"')
  }
  if (!reply) {
    throw Error('Missing "reply"')
  }

  reducer.register<S, A>(
    trigger,
    (state: S, action: A, dispatch: DispatchF) => {
      const ctxtP = context ? context(action, state) : null
      if (ctxtP) {
        // const s = current(state) // need
        ctxtP
          .then((ctxt) => handleEvent(null as unknown as S, action, dispatch, ctxt))
          .catch((err) => {
            const a: ContextErrorAction = {
              type: ACTION_TYPES.CONTEXT_ERROR,
              error: err.toString(),
              pendingAction: action
            }
            dispatch(a)
          })
      } else {
        // we should remove state as argument
        handleEvent(null as unknown as S, action, dispatch, {} as any)
      }
      return state
    })

  function handleEvent(state: S, action: A, dispatch: DispatchF, ctxt: C): S {
    if (guard) {
      if (!guard(action, state, dispatch, ctxt)) {
        return state
      }
    }
    let bindings: Bindings = {}
    let request: RequestInit
    let url2: URL
    try {
      ;[request, bindings] = requestF(state, action)
      if (headers) {
        const h = headers(action, state, ctxt)
        request.headers = request.headers ? { ...request.headers, ...h } : h
      }
      let o: string
      if (typeof origin === "function") {
        const ox = origin(action, state, ctxt)
        o = ox instanceof URL ? ox.toString() : ox
      } else {
        o = origin
      }
      url2 = buildURL(url, o, bindings)
    } catch (e: any) {
      dispatch({
        type: intErrorType,
        error: e?.message,
        call: name,
        action,
        bindings,
      })
      return state
    }

    dispatch({
      type: submitType,
      requestID: name,
      url: url2.toString(),
      bindings,
    })
    _fetch(url2, request)
      .then((resp) => {
        if (resp.statusCode < 300) {
          const a: ResultAction<A> = {
            type: resultType,
            queryID: name,
            ...resp,
            url: url2.toString(),
            request: action,
          }
          dispatch(a)
        } else {
          const a = createErrorAction(errorType, resp, name, url2, action)
          dispatch(a)
        }
      })
      .catch((error) => console.log("_fetch", error))
    return state
  }

  reducer.register<S, ResultAction<A>>(resultType, (state, ra, dispatch) => {
    return reply(state, ra.content, dispatch, ra)
  })

  if (error) {
    reducer.register<S, ErrorAction<A>>(
      errorType,
      (state, action, dispatch) => {
        return error(state, action, action.request, dispatch)
      },
    )
  }
}

function buildURL(url: string, origin: string, bindings: Bindings): URL {
  const u = new URL(url, origin)
  u.pathname = u.pathname
    .split("/")
    .map((p) => {
      return resolveBinding(p, bindings, encodeURIComponent)
    })
    .join("/")
  if (u.search !== "") {
    const params = new URLSearchParams()
    u.searchParams.forEach((v, k) => {
      const v2 = resolveBinding(v, bindings)
      if (v2) {
        params.set(k, v2)
      }
    })
    u.search = "?" + params.toString()
  }
  return u
}

function resolveBinding(
  value: string,
  bindings: Bindings,
  encoder: ((v: string) => string) | undefined = undefined,
): string | undefined {
  const first = value[0]
  if (first === ":" || first === "?") {
    const k = value.slice(1)
    let v = bindings[k]
    if (v === undefined) {
      if (first === "?") {
        return undefined
      } else {
        throw new Error(`Missing binding '${k}'.`)
      }
    }
    if (typeof v !== "string") {
      v = `${v}`
    }
    return encoder ? encoder(v) : v
  } else {
    return value
  }
}

function _fetch(url: URL, request: RequestInit): Promise<HttpResponse> {
  return fetch(url, request)
    .then(parseResponse)
    .then(([content, contentType, response]) => {
      return {
        statusCode: response.status,
        content,
        contentType,
        headers: response.headers,
      }
    })
}
