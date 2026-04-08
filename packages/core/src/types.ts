export type ReduxState = {
  route: Route;

  pihanga?: {[key: string]: any};
};

export type Route = {
  path: string[];
  query: PathQuery;
  url: string;
  fromBrowser?: boolean;
};
export type PathQuery = {[k: string]: string | number | boolean};

export type ReduxAction = {
  type: string;
};

export type CardAction = ReduxAction & {
  cardID: string;
};

export type PiRegisterComponent = {
  name: string;
  component: any; // ReactComponent
  events?: {[key: string]: string};
  // defaults?: { [key: string]: any }
};

export type DispatchPTimeoutAction = ReduxAction & {
  cause: "timeout";
  /** Correlation token to route to the correct handler */
  token: string;
  /** The awaited reply action type */
  replyType: string;
};

export type ReduceF<S extends ReduxState, A extends ReduxAction> = (
  state: S,
  action: A,
  dispatch: DispatchF,
  opts?: ReduceOpts<S>,
) => void; // S

export type ReduceOnceF<S extends ReduxState, A extends ReduxAction> = (
  state: S,
  action: A,
  dispatch: DispatchF,
  opts?: ReduceOpts<S>,
) => boolean; // [S, boolean]

export type DispatchF = <T extends ReduxAction>(a: T) => void;

/**
 * Options passed to reducer mappers.
 */
export interface ReduceOpts<S extends ReduxState> {
  /**
   * The current redux state **before** immer's draft wrapping.
   */
  rawState: Readonly<S>;

  /**
   * Dispatch a request action (after the current reducer has finished) and then
   * handle the next matching reply.
   */
  dispatchP: <
    Req extends ReduxAction,
    Rep extends ReduxAction,
    Err extends Rep = never,
  >(
    request: Req,
    opts: {
      replyType: string;
      timeoutMs?: number;
      matchReply?: (reply: Rep) => boolean;
      matchError?: (reply: Rep) => reply is Err;
    },
    onReply: (
      state: S,
      action: Rep,
      dispatch: DispatchF,
      opts?: ReduceOpts<S>,
    ) => void,
    onError?: (
      state: S,
      action: Err,
      dispatch: DispatchF,
      opts?: ReduceOpts<S>,
    ) => void,
    onTimeout?: (
      state: S,
      action: DispatchPTimeoutAction,
      dispatch: DispatchF,
      opts?: ReduceOpts<S>,
    ) => void,
  ) => void;
}

export interface PiReducer {
  register: PiRegisterReducerF;
  registerOneShot: PiRegisterOneShotReducerF;
  dispatch: DispatchF;
  dispatchFromReducer: DispatchF;
}

export const DEF_REDUCER_PRIORITY = 0;

export type PiRegisterReducerF = <S extends ReduxState, A extends ReduxAction>(
  eventType: string,
  mapper: ReduceF<S, A>, // (state: S, action: A, dispatch: DispatchF) => S,
  priority?: number,
  key?: string,
  targetMapper?: ReduceF<S, A>,
) => PiReducerCancelF;

export type PiReducerCancelF = () => void;

export type PiRegisterOneShotReducerF = <
  S extends ReduxState,
  A extends ReduxAction,
>(
  eventType: string,
  mapper: ReduceOnceF<S, A>,
  priority?: number,
) => void;

// CARDS

// context props given to <Card> in parent card
export type PiDefCtxtProps = {[k: string]: any};

// type for <Card .../>
export type CardProp = {
  cardName: PiCardRef;
  cardKey?: string;
  parentCard: string;
} & PiDefCtxtProps;

// props for the 'root' of all cards
export type WindowProps = {
  page: PiCardRef;
  framework?: string; // select framework to render window
  theme?: any; // depends on framework
};

// type which needs to be implemented by card components
export type PiCardProps<P, E = {}> = P & {
  cardName: string;
  children?: React.ReactNode[];
  _cls: (elName: string | string[], className?: string) => string;
  _dispatch: DispatchF;
} & {
  [Key in keyof E]: (ev: E[Key]) => void;
};

export type CSSModuleClasses = {readonly [key: string]: string};

export type PiCardRef = string | PiCardDef;

export type RefF = any;
export type StateMapper<T, S extends ReduxState, C = PiDefCtxtProps> = (
  state: S,
  context: StateMapperContext<C>,
) => T;

export type StateMapperContext<C> = {
  cardName: string;
  cardKey?: string;
  ctxtProps: C;
  ref?: RefF;
};

export type PiMapProps<
  CType,
  S extends ReduxState,
  EType = {},
  C = PiDefCtxtProps,
> = {
  [Property in keyof CType]:
    | CType[Property]
    | StateMapper<CType[Property], S, C>;
} & EventHandler<EType, S> &
  EventMapper<EType, C>;

export type EventHandler<T, S extends ReduxState> = {
  [Key in keyof T]?: ReduceF<S, T[Key] & ReduxAction>;
};

export type EventMapper<T, C = PiDefCtxtProps> = {
  [Key in keyof T as `${Key & string}Mapper`]?: (
    ev: T[Key],
    ctxt: C,
  ) => ReduxAction | null;
};

export type GenericCardParameterT =
  | unknown
  | StateMapper<unknown, ReduxState, unknown>;

export type PiCardDef = {
  cardType: string;
} & {
  [k: string]: GenericCardParameterT;
};

// METACARD

export type PiRegisterMetaCard = {
  type: string;
  mapper: MetaCardMapperF;
  events?: {[key: string]: string};
};

export type RegisterCardF = (name: string, parameters: PiCardDef) => PiCardRef;
export type MetaCardMapperF = (
  name: string,
  props: any,
  registerCard: RegisterCardF,
) => PiCardDef;
