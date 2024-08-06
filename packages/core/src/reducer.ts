import { Action, Reducer } from "@reduxjs/toolkit"
import {
  DispatchF,
  PiReducer,
  PiRegisterOneShotReducerF,
  PiRegisterReducerF,
  ReduceF,
  ReduceOnceF,
  ReduxAction,
  ReduxState,
} from "./types"
import { produce } from "immer"
import { RegisterCardState, UPDATE_STATE_ACTION } from "./card"
import StackTrace from "stacktrace-js"
import { getLogger } from "./logger"
import { Dispatch } from "react"
import { currentRoute } from "./router"

const logger = getLogger("reducer")

type ReducerDef<S extends ReduxState, A extends ReduxAction> = {
  mapperMany?: ReduceF<S, A>
  mapperOnce?: ReduceOnceF<S, A>
  priority?: number
  key?: string
  definedIn?: StackTrace.StackFrame
}

export function createReducer(
  initialState: ReduxState,
  dispatcher: Dispatch<any>,
): [Reducer<ReduxState, Action>, PiReducer] {
  const mappings: { [k: string]: ReducerDef<ReduxState, Action>[] } = {}
  mappings[UPDATE_STATE_ACTION] = [{ mapperMany: RegisterCardState.reducer }]

  const delayedDispatcher = (a: any): void => {
    setTimeout(() => dispatcher(a), 0)
  }
  const reducer = (
    state: ReduxState | undefined,
    action: Action,
  ): ReduxState => {
    const s = state || initialState
    const ra = mappings[action.type]
    const rany = mappings["*"]
    if ((!ra || ra.length === 0) && (!rany || rany.length === 0)) {
      return s
    }

    const nextState = produce<ReduxState, ReduxState>(s, (draft) => {
      if (ra) {
        const rout = _reduce(ra, draft, action, delayedDispatcher)
        mappings[action.type] = rout
      }
      if (rany) {
        const rout2 = _reduce(rany, draft, action, delayedDispatcher)
        mappings["*"] = rout2
      }
      return
    })
    return nextState
  }

  const registerReducer: PiRegisterReducerF = <
    S extends ReduxState,
    A extends ReduxAction,
  >(
    eventType: string,
    mapper: ReduceF<S, A>,
    priority: number = 0,
    key: string | undefined = undefined
  ): void => {
    addReducer(eventType, { mapperMany: mapper, priority, key })
  }

  const registerOneShot: PiRegisterOneShotReducerF = <
    S extends ReduxState,
    A extends ReduxAction,
  >(
    eventType: string,
    mapper: (state: S, action: A, dispatch: DispatchF) => boolean,
    priority: number = 0,
    key: string | undefined = undefined
  ): void => {
    addReducer(eventType, { mapperOnce: mapper, priority, key })
  }

  function addReducer<S extends ReduxState, A extends ReduxAction>(
    eventType: string,
    reducerDef: ReducerDef<S, A>,
    // mappings: { [k: string]: ReducerDef<ReduxState, Action>[] }
  ) {
    let m = mappings[eventType] || []
    if (reducerDef.key) {
      // remove reducer with same key - if there is one
      m = m.filter((r) => r.key !== reducerDef.key)
    }
    m.push(reducerDef as any as ReducerDef<ReduxState, Action<any>>) // keep typing happy
    m.sort((a, b) => (b.priority || 0) - (a.priority || 0))
    mappings[eventType] = m

    const callback = (frames: StackTrace.StackFrame[]) => {
      // const stack = frames.map((sf) => `${sf.fileName}:${sf.lineNumber}`)
      // console.log(stack)
      reducerDef.definedIn = frames[2]
    }

    const errback = (err: any) => {
      logger.warn(err.message)
    }
    StackTrace.get().then(callback).catch(errback)
  }

  const piReducer: PiReducer = {
    register: registerReducer,
    registerOneShot,
    dispatch: dispatcher,
    dispatchFromReducer: delayedDispatcher,
  }

  return [reducer, piReducer]
}

function _reduce(
  ra: ReducerDef<ReduxState, Action>[],
  draft: ReduxState,
  action: Action,
  delayedDispatcher: (a: any) => void,
): ReducerDef<ReduxState, Action<any>>[] {
  const rout: ReducerDef<ReduxState, Action<any>>[] = []
  ra.forEach((m) => {
    try {
      if (m.mapperMany) {
        m.mapperMany(draft, action, delayedDispatcher)
        rout.push(m)
      } else if (m.mapperOnce) {
        const flag = m.mapperOnce(draft, action, delayedDispatcher)
        if (!flag) {
          rout.push(m)
        }
      }
    } catch (err: any) {
      logger.error(err.message, m.definedIn)
    }
  })
  return rout
}