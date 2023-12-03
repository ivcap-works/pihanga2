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

const logger = getLogger("reducer")

type ReducerDef<S extends ReduxState, A extends ReduxAction> = {
  mapperMany?: ReduceF<S, A>
  mapperOnce?: ReduceOnceF<S, A>
  priority?: number
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
    if (!ra || ra.length === 0) {
      return s
    }

    const nextState = produce<ReduxState, ReduxState>(s, (draft) => {
      const rout: ReducerDef<ReduxState, Action<any>>[] = []
      const outDraft = ra.reduce((d, m) => {
        try {
          if (m.mapperMany) {
            const s = m.mapperMany(d, action, delayedDispatcher)
            rout.push(m)
            return s
          } else if (m.mapperOnce) {
            const [s, flag] = m.mapperOnce(d, action, delayedDispatcher)
            if (!flag) {
              rout.push(m)
            }
            return s
          } else {
            return d
          }
        } catch (err: any) {
          logger.error(err.message, m.definedIn)
          return d
        }
      }, draft)
      mappings[action.type] = rout
      return outDraft
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
  ): void => {
    addReducer(eventType, { mapperMany: mapper, priority })
  }

  const registerOneShot: PiRegisterOneShotReducerF = <
    S extends ReduxState,
    A extends ReduxAction,
  >(
    eventType: string,
    mapper: (state: S, action: A, dispatch: DispatchF) => [S, boolean],
    priority: number = 0,
  ): void => {
    addReducer(eventType, { mapperOnce: mapper, priority })
  }

  function addReducer<S extends ReduxState, A extends ReduxAction>(
    eventType: string,
    reducerDef: ReducerDef<S, A>,
    // mappings: { [k: string]: ReducerDef<ReduxState, Action>[] }
  ) {
    const m = mappings[eventType] || []
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
