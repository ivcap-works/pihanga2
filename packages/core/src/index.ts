import ReactDOM from "react-dom/client"
import { Dispatch } from "react"

import {
  PiCardDef,
  PiCardRef,
  PiRegisterComponent,
  ReduxAction,
  ReduxState,
  PiReducer,
  RegisterCardF,
  MetaCardMapperF,
  PiRegisterMetaCard,
  PiMapProps,
  WindowProps,
  GenericCardParameterT,
} from "./types"
import { createCardDeclaration, registerCard, registerCardComponent, registerMetacard, updateOrRegisterCard } from "./register_cards"
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
import { RootComponent } from "./root"
const logger = getLogger("root")

export type {
  PiMapProps,
  PiCardDef,
  RegisterCardF,
  ReduxState,
  ReduxAction,
  DispatchF,
  ReduceF,
  PiDefCtxtProps,
  StateMapperContext,
  StateMapper,
  PiReducer,
  PiRegisterMetaCard,
  WindowProps,
} from "./types"
export { registerActions, actionTypesToEvents, createOnAction } from "./redux"
export { Card } from "./card"
export { memo, createCardDeclaration, isCardRef } from "./register_cards"
export { getLogger } from "./logger"
export type { PiCardProps, PiCardRef } from "./types"
export type { ErrorAction as RestErrorAction } from "./rest"
export { RestContentType } from "./rest"

export { showPage, onInit, onShowPage, createShowPageAction, onNavigateToPage } from "./router"
export type { ShowPageEvent, NavigateToPageEvent } from "./router"

export interface PiRegister {
  //window(parameters: PiCardDef): PiCardRef

  window<S extends ReduxState>(parameters: PiMapProps<WindowProps, S, {}>): PiCardRef

  card(name: string, parameters: PiCardDef): PiCardRef
  updateCard(name: string, parameters: { [key: string]: GenericCardParameterT }): PiCardRef

  cardComponent(declaration: PiRegisterComponent): void

  /**
   * Register a meta card which expands a single card definition of type `name`
   * into a new set of cards which can be registered in turn through `registerCards`.
   *
   * The `transformF` function takes the property declaration and uses the
   * the common `PiRegister` to define the inner content of this meta card
   *
   * @param {string} type
   * @param {function} mapper
   */
  metaCard<C>(declaration: PiRegisterMetaCard): void

  GET<S extends ReduxState, A extends ReduxAction, R, C = any>(
    props: PiRegisterGetProps<S, A, R, C>,
  ): void
  PUT<S extends ReduxState, A extends ReduxAction, R, C = any>(
    props: PiRegisterPoPuPaProps<S, A, R, C>,
  ): void
  POST<S extends ReduxState, A extends ReduxAction, R, C = any>(
    props: PiRegisterPoPuPaProps<S, A, R, C>,
  ): void
  PATCH<S extends ReduxState, A extends ReduxAction, R, C = any>(
    props: PiRegisterPoPuPaProps<S, A, R, C>,
  ): void
  DELETE<S extends ReduxState, A extends ReduxAction, R, C = any>(
    props: PiRegisterDeleteProps<S, A, R, C>,
  ): void
  //registerPeriodicGET<S extends ReduxState, A extends ReduxAction, R>(props: PiRegisterPeridicGetProps<S, A, R>): void;

  reducer: PiReducer
}

export const DEFAULT_REDUX_STATE = {
  route: { path: [], query: {}, url: "", fromBrowser: false },
  pihanga: {},
}

export type StartProps = {
  // redux settins
  disableSerializableStateCheck?: boolean
  disableSerializableActionCheck?: boolean
  ignoredActions?: string[]
  ignoredActionPaths?: string[]
  ignoredStatePaths?: string[]
}

export function start<S extends Partial<ReduxState>>(
  initialState: S,
  inits: ((register: PiRegister) => void)[] = [],
  props: StartProps = {}
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

  const ignoredActions = ([] as string[]).concat(props.ignoredActions || [])
  const ignoredActionPaths = [
    "apiURL", // from IVCAP
    "mapper",
    "content", // from REST
    "request",
    "headers",
    "cause",
    "data",
  ].concat(props.ignoredActionPaths || [])
  const ignoredPaths = ["cause.content"].concat(props.ignoredStatePaths || [])

  const store = configureStore({
    reducer,
    preloadedState: state as any, // keep type checking happy
    // enhancers: [monitorReducerEnhancer as unknown as StoreEnhancer],
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions,
          ignoredActionPaths,
          ignoredPaths,
          ignoreState: props.disableSerializableStateCheck,
          ignoreAction: props.disableSerializableActionCheck,
        }
      })
  })
  dispatchF = store.dispatch

  const card = registerCard(piReducer.register, dispatchF)
  const updateCard = updateOrRegisterCard(piReducer.register, dispatchF)
  const window = <S extends ReduxState>(p: PiMapProps<WindowProps, S, {}>): PiCardRef => {
    return card("_window", { cardType: "framework", ...p })
  }


  const register: PiRegister = {
    window,
    card,
    updateCard,
    cardComponent: registerCardComponent,
    metaCard: registerMetacard(card),
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
