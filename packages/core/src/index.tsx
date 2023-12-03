import React from "react"
import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"
import { Dispatch } from "react"

import {
  PiCardDef,
  PiCardRef,
  PiRegisterComponent,
  ReduxAction,
  ReduxState,
  PiReducer,
} from "./types"
import { Card, registerCard, registerCardComponent } from "./card"
import { createReducer } from "./reducer"
import { ON_INIT_ACTION, currentRoute, init as routerInit } from "./router"

import { configureStore } from "@reduxjs/toolkit"

//import monitorReducerEnhancer from "./monitor_enhancer"
import { getLogger } from "./logger"
import {
  PiRegisterDeleteProps,
  PiRegisterGetProps,
  PiRegisterPoPuPaProps,
  registerDELETE,
  registerGET,
  registerPATCH,
  registerPOST,
  registerPUT,
} from "./rest"
const logger = getLogger("root")

export type {
  PiMapProps,
  PiCardDef,
  ReduxState,
  ReduxAction,
  DispatchF,
} from "./types"
export { registerActions, actionTypesToEvents, createOnAction } from "./redux"
export { Card, memo, createCardDeclaration } from "./card"
export { getLogger } from "./logger"
export type { PiCardProps, PiCardRef } from "./types"
export type { ErrorAction as RestErrorAction } from "./rest"

export { showPage, onInit, onShowPage, onNavigateToPage } from "./router"
export type { ShowPageEvent, NavigateToPageEvent } from "./router"

export interface PiRegister {
  card(name: string, parameters: PiCardDef): PiCardRef

  cardComponent(declaration: PiRegisterComponent): void

  /**
   * Register a meta card which expands a single card definition of type `name`
   * into a new set of cards which can be registered in turn through `registerCards`.
   *
   * The `transformF` function takes the `cardName` and `cardDef` as the two paramters
   * and is expected to return a map where the keys are new card anmes and their respective
   * values the respective card declaration.
   *
   * @param {string} type
   * @param {function} transformF
   */
  // metaCard<T>(type: string, transformF: PiMetaTransformerF<T>): void;

  GET<S extends ReduxState, A extends ReduxAction, R>(
    props: PiRegisterGetProps<S, A, R>,
  ): void
  PUT<S extends ReduxState, A extends ReduxAction, R>(
    props: PiRegisterPoPuPaProps<S, A, R>,
  ): void
  POST<S extends ReduxState, A extends ReduxAction, R>(
    props: PiRegisterPoPuPaProps<S, A, R>,
  ): void
  PATCH<S extends ReduxState, A extends ReduxAction, R>(
    props: PiRegisterPoPuPaProps<S, A, R>,
  ): void
  DELETE<S extends ReduxState, A extends ReduxAction, R>(
    props: PiRegisterDeleteProps<S, A, R>,
  ): void
  //registerPeriodicGET<S extends ReduxState, A extends ReduxAction, R>(props: PiRegisterPeridicGetProps<S, A, R>): void;

  reducer: PiReducer
}

export const DEFAULT_REDUX_STATE = {
  route: { path: [], query: {}, url: "", fromBrowser: false },
  pihanga: {},
}

export function start<S extends Partial<ReduxState>>(
  initialState: S,
  inits: ((register: PiRegister) => void)[] = [],
): PiRegister {
  const state = {
    ...DEFAULT_REDUX_STATE,
    ...initialState,
    ...{ route: currentRoute() }, // override route with current one
  }
  let dispatchF: Dispatch<any> | null = null
  const dispatcherW: Dispatch<any> = (a: any): void => {
    if (dispatchF) {
      dispatchF(a)
    } else {
      logger.error("dispatch function is not properly set")
    }
  }
  const [reducer, piReducer] = createReducer(state, dispatcherW)
  const route = routerInit(piReducer)
  const store = configureStore({
    reducer,
    preloadedState: state as any, // keep type checking happy
    // enhancers: [monitorReducerEnhancer as unknown as StoreEnhancer],
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          //ignoredActions: ['your/action/type'],
          ignoredActionPaths: [
            "apiURL", // from IVCAP
            "mapper",
            "content", // from REST
            "request",
            "headers",
            "cause",
          ],
          // ignoredPaths: ["cause.content"],
        },
      }),
  })
  dispatchF = store.dispatch

  const register: PiRegister = {
    card: registerCard(piReducer.register),
    cardComponent: registerCardComponent,
    reducer: piReducer,
    GET: registerGET(piReducer),
    PUT: registerPUT(piReducer),
    POST: registerPOST(piReducer),
    PATCH: registerPATCH(piReducer),
    DELETE: registerDELETE(piReducer),
  }
  inits.forEach((f) => f(register))

  piReducer.dispatch({ type: ON_INIT_ACTION })

  const rootComp = RootComponent(store)
  const root = ReactDOM.createRoot(document.getElementById("root")!)
  root.render(rootComp)

  return register
}

function RootComponent(store: any) {
  return (
    <React.StrictMode>
      <Provider store={store}>
        <Card cardName="page" />
      </Provider>
    </React.StrictMode>
  )
}
