import {Action, Reducer} from "@reduxjs/toolkit";
import {
  DispatchF,
  DispatchPipeTimeoutAction,
  PiReducer,
  PiReducerCancelF,
  PiRegisterOneShotReducerF,
  PiRegisterReducerF,
  ReduceOpts,
  ReduceF,
  ReduceOnceF,
  ReduxAction,
  ReduxState,
} from "./types";
import {produce} from "immer";
import {RegisterCardState, UPDATE_STATE_ACTION} from "./card";
import StackTrace from "stacktrace-js";
import {getLogger} from "./logger";
import {Dispatch} from "react";
import {currentRoute} from "./router";

const logger = getLogger("reducer");

type ReducerDef<S extends ReduxState, A extends ReduxAction> = {
  mapperMulti?: ReduceF<S, A>;
  mapperOnce?: ReduceOnceF<S, A>;
  priority?: number;
  key?: string;
  definedIn?: StackTrace.StackFrame;
  targetMapper?: ReduceF<S, A>;
};

type Source = {
  file?: string;
  line?: number;
  column?: number;
  functionName?: string;
};

export function createReducer(
  initialState: ReduxState,
  dispatcher: Dispatch<any>,
): [Reducer<ReduxState, Action>, PiReducer] {
  const mappings: {[k: string]: ReducerDef<ReduxState, Action>[]} = {};
  mappings[UPDATE_STATE_ACTION] = [
    {
      mapperMulti: RegisterCardState.reducer,
      key: "@builtin:card:UPDATE_STATE_ACTION",
    },
  ];

  const delayedDispatcher = (a: any): void => {
    setTimeout(() => dispatcher(a), 0);
  };

  const DISPATCH_PIPE_REDUCE_TIMEOUT_TYPE = "pi/dispatchPipe/timeout";

  const dispatchPipe: ReduceOpts<ReduxState>["dispatchPipe"] = (
    request,
    pOpts,
    onReply,
    onError,
    onTimeout,
  ) => {
    const {replyType, timeoutMs = 10000, matchReply, matchError} = pOpts;

    // Use a token so we can route timeout actions.
    const token = `${Date.now()}:${Math.random()}`;

    // Use `register` (not registerOneShot) so we can cancel explicitly.
    const keyReply = `dispatchPipe:reply:${replyType}:${token}`;
    const keyTimeout = `dispatchPipe:timeout:${replyType}:${token}`;

    let settled = false;

    let cancelReply: PiReducerCancelF = () => {};
    let cancelTimeout: PiReducerCancelF = () => {};
    let timer: ReturnType<typeof setTimeout> | undefined;

    const cleanup = () => {
      cancelReply();
      cancelTimeout();
      if (timer) {
        clearTimeout(timer);
      }
    };

    // Reply handler: decides whether to call onReply or onError.
    cancelReply = registerReducer(
      replyType,
      (s2: any, a2: any, d2: any, o2: any) => {
        if (settled) return;
        if (matchReply && !matchReply(a2)) return;
        settled = true;
        cleanup();

        // If matchError is provided and the action matches, treat as error.
        if (matchError && matchError(a2)) {
          if (onError) {
            onError(s2, a2, d2, o2);
          } else {
            // Fall back to onReply if no onError was provided.
            onReply(s2, a2, d2, o2);
          }
          return;
        }
        onReply(s2, a2, d2, o2);
      },
      0,
      keyReply,
    );

    // Timeout handler: triggered by a dispatched internal timeout action.
    if (onTimeout) {
      cancelTimeout = registerReducer(
        DISPATCH_PIPE_REDUCE_TIMEOUT_TYPE,
        (s2: any, a2: any, d2: any, o2: any) => {
          if (settled) return;
          if (!a2 || a2.token !== token) return;
          settled = true;
          cleanup();
          onTimeout(s2, a2, d2, o2);
        },
        0,
        keyTimeout,
      );
    }

    timer = setTimeout(() => {
      if (settled) return;
      if (!onTimeout) {
        // no timeout handler requested
        cleanup();
        return;
      }
      const timeoutAction: DispatchPipeTimeoutAction = {
        type: DISPATCH_PIPE_REDUCE_TIMEOUT_TYPE,
        cause: "timeout",
        token,
        replyType,
      };
      delayedDispatcher(timeoutAction);
    }, timeoutMs);

    // Must dispatch after the current reducer tick.
    delayedDispatcher(request);
  };
  const reducer = (
    state: ReduxState | undefined,
    action: Action,
  ): ReduxState => {
    const s = state || initialState;
    const ra = mappings[action.type];
    const rany = mappings["*"];
    if ((!ra || ra.length === 0) && (!rany || rany.length === 0)) {
      const ra = s.pihanga?.reducers;
      if (ra && ra.length > 0) {
        return produce<ReduxState, ReduxState>(s, (draft) => {
          if (draft.pihanga) {
            draft.pihanga.reducers = [];
          }
        });
      }
      return s;
    }

    const nextState = produce<ReduxState, ReduxState>(s, (draft) => {
      const opts: ReduceOpts<ReduxState> = {
        rawState: s,
        dispatchPipe: dispatchPipe,
      };
      if (!draft.pihanga) {
        draft.pihanga = {};
      }
      draft.pihanga.reducers = [];
      if (ra) {
        const rout = _reduce(ra, draft, action, delayedDispatcher, opts);
        mappings[action.type] = rout;
      }
      if (rany) {
        const rout2 = _reduce(rany, draft, action, delayedDispatcher, opts);
        mappings["*"] = rout2;
      }
      return;
    });
    return nextState;
  };

  const registerReducer: PiRegisterReducerF = <
    S extends ReduxState,
    A extends ReduxAction,
  >(
    eventType: string,
    mapper: ReduceF<S, A>,
    priority: number = 0,
    key?: string,
    targetMapper?: ReduceF<S, A>,
  ): PiReducerCancelF => {
    return addReducer(eventType, {
      mapperMulti: mapper,
      priority,
      key,
      targetMapper,
    });
  };

  const registerOneShot: PiRegisterOneShotReducerF = <
    S extends ReduxState,
    A extends ReduxAction,
  >(
    eventType: string,
    mapper: ReduceOnceF<S, A>,
    priority: number = 0,
    key: string | undefined = undefined,
  ): PiReducerCancelF => {
    return addReducer(eventType, {mapperOnce: mapper, priority, key});
  };

  const nonCancelF = () => {};

  function addReducer<S extends ReduxState, A extends ReduxAction>(
    eventType: string,
    reducerDef: ReducerDef<S, A>,
  ): PiReducerCancelF {
    let m = mappings[eventType] || [];
    const key = reducerDef.key;
    m = removeReducer(key, m);
    m.push(reducerDef as any as ReducerDef<ReduxState, Action<any>>); // keep typing happy
    m.sort((a, b) => (b.priority || 0) - (a.priority || 0));
    mappings[eventType] = m;

    if (!reducerDef.key) {
      const frames = StackTrace.getSync();
      const sf = _get_source_frame(frames);
      if (sf) {
        // reducerDef.definedIn = sf;
        reducerDef.key = sf.toString();
      } else {
        reducerDef.definedIn = sf;
        console.log(">> cannot find source frame", eventType, frames);
      }
    }

    return key
      ? () => {
          let m = mappings[eventType] || [];
          mappings[eventType] = removeReducer(key, m);
        }
      : nonCancelF;
  }

  const piReducer: PiReducer = {
    register: registerReducer,
    registerOneShot,
    dispatch: dispatcher,
    dispatchFromReducer: delayedDispatcher,
  };

  return [reducer, piReducer];
}

function removeReducer(
  key: string | undefined,
  m: ReducerDef<ReduxState, Action>[],
) {
  if (key) {
    return m.filter((r) => r.key !== key);
  } else {
    return m;
  }
}

function _reduce(
  ra: ReducerDef<ReduxState, Action>[],
  draft: ReduxState,
  action: Action,
  delayedDispatcher: (a: any) => void,
  opts: ReduceOpts<ReduxState>,
): ReducerDef<ReduxState, Action<any>>[] {
  const rout: ReducerDef<ReduxState, Action<any>>[] = [];
  ra.forEach((m) => {
    try {
      // if (m.definedIn || m.key) {
      //   console.log(">>> executing reducer", action.type, m.key, m.definedIn);
      // }
      if (m.mapperMulti) {
        draft.pihanga?.reducers?.push(m.definedIn || m.key || "unknown");
        m.mapperMulti(draft, action, delayedDispatcher, opts);
        rout.push(m);
      } else if (m.mapperOnce) {
        draft.pihanga?.reducers?.push(m.definedIn || m.key || "unknown");
        const flag = m.mapperOnce(draft, action, delayedDispatcher, opts);
        if (!flag) {
          rout.push(m);
        }
      }
    } catch (err: any) {
      logger.error(err.message, m.definedIn);
    }
  });
  return rout;
}

function _get_source_frame(
  frames: StackTrace.StackFrame[],
): StackTrace.StackFrame | undefined {
  // Heuristic: frame 0 = Error, 1 = getCallerSiteInBrowser, 2 = your function, 3 = its caller
  for (let i = 3; i < frames.length; i++) {
    const f = frames[i];
    const fn = f.fileName;
    if (_is_src_file(fn)) {
      return f;
    }
  }
  return undefined;
}

function _is_src_file(url: string | undefined): boolean {
  if (!url) return false;
  const m = url.match(/^(?:[a-z][a-z0-9+.-]*:)?\/\/[^\/]+\/([^\/?#]+)/);
  if (m) {
    const p1 = m[1];
    const flag = !(p1.startsWith("@") || p1 === "node_modules");
    return flag;
  }
  return true;
}
