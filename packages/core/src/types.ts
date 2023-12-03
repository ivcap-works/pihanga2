export type ReduxState = {
  route: Route

  pihanga?: { [key: string]: any }
}

export type Route = {
  path: string[]
  query: PathQuery
  url: string
  fromBrowser?: boolean
}
export type PathQuery = { [k: string]: string | number | boolean }

export type ReduxAction = {
  type: string
}

export type CardAction = ReduxAction & {
  cardID: string
}

export type PiRegisterComponent = {
  name: string
  component: any // ReactComponent
  events?: { [key: string]: string }
  // defaults?: { [key: string]: any }
}

export type ReduceF<S extends ReduxState, A extends ReduxAction> = (
  state: S,
  action: A,
  dispatch: DispatchF,
) => S
export type ReduceOnceF<S extends ReduxState, A extends ReduxAction> = (
  state: S,
  action: A,
  dispatch: DispatchF,
) => [S, boolean]

export type DispatchF = <T extends ReduxAction>(a: T) => void

export interface PiReducer {
  register: PiRegisterReducerF
  registerOneShot: PiRegisterOneShotReducerF
  dispatch: DispatchF
  dispatchFromReducer: DispatchF
}

export type PiRegisterReducerF = <S extends ReduxState, A extends ReduxAction>(
  eventType: string,
  mapper: ReduceF<S, A>, // (state: S, action: A, dispatch: DispatchF) => S,
  priority?: number,
) => void

export type PiRegisterOneShotReducerF = <
  S extends ReduxState,
  A extends ReduxAction,
>(
  eventType: string,
  mapper: ReduceOnceF<S, A>,
  priority?: number,
) => void


// export type MapperF<S extends ReduxState, A extends ReduxAction> = (
//   state: S,
//   action: A,
//   dispatch: DispatchF,
// ) => S

// CARDS

export type PiCardProps<P, E extends { [k: string]: any } = {}> = P & {
  cardName: string
  children?: React.ReactNode
  _cls: (elName: string | string[], styles?: CSSModuleClasses) => string
  _dispatch: DispatchF
} & {
    [Key in keyof E]: (ev: E[Key]) => void
  }

export type PiCardRef = string | PiCardDef

// context props given to <Card> in parent card
type PiDefCtxtProps = { [k: string]: any }
// type PiCtxtProps<T = PiDefCtxtProps> = T

type RefF = any
export type StateMapper<T, S extends ReduxState, C = PiDefCtxtProps> = (
  state: S,
  context: StateMapperContext<C>,
) => T

export type StateMapperContext<C> = {
  cardName: string
  ctxtProps: C
  ref?: RefF
}

export type PiMapProps<
  CType,
  S extends ReduxState,
  EType = {},
  C = PiDefCtxtProps,
> = {
  [Property in keyof CType]:
  | CType[Property]
  | StateMapper<CType[Property], S, C>
} & EventHandler<EType, S> &
  EventMapper<EType>

type EventHandler<T, S extends ReduxState> = {
  [Key in keyof T]?: ReduceF<S, T[Key] & ReduxAction>
}

type EventMapper<T> = {
  [Key in keyof T as `${Key & string}Mapper`]?: (ev: T[Key]) => ReduxAction
}

export type GenericCardParameterT =
  | unknown
  | StateMapper<unknown, ReduxState, unknown>

export type PiCardDef = {
  cardType: string
} & {
  [k: string]: GenericCardParameterT
}
