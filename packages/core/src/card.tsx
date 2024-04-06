import React from 'react'
import { useDispatch, useSelector } from "react-redux"

import { getLogger } from "./logger"
import {
  CSSModuleClasses,
  CardAction,
  CardProp,
  DispatchF,
  MetaCardMapperF,
  PiCardDef,
  PiCardRef,
  PiMapProps,
  PiRegisterComponent,
  PiRegisterMetaCard,
  PiRegisterReducerF,
  ReduxState,
  RegisterCardF,
  StateMapper,
  StateMapperContext,
} from "./types"
import { Action, AnyAction, Dispatch } from "@reduxjs/toolkit"

export function isCardRef(p: any): boolean {
  return (typeof p === "object" && p.cardType !== undefined)
}

type Mapping = {
  cardType: string
  props: { [k: string]: unknown }
  eventMappers: { [k: string]: (ev: Action) => Action | null }
}

type MetaCard = {
  type: string
  registerCard: RegisterCardF
  mapper: MetaCardMapperF
  events?: { [key: string]: string }
}

const cardTypes: { [k: string]: PiRegisterComponent } = {}
const metacardTypes: { [k: string]: MetaCard } = {}

let framework: string // name of active UI framework
const cardMappings: { [k: string]: Mapping } = {}
const dispatch2registerReducer: [React.Dispatch<any>, PiRegisterReducerF][] = []
const logger = getLogger("card")

export function registerCardComponent(card: PiRegisterComponent): void {
  if (cardTypes[card.name]) {
    logger.warn(`Overwriting definition for card type "${card.name}"`)
  }
  logger.info(`Register card type "${card.name}"`)
  if (!framework) {
    // set default framework
    const na = card.name.split("/")
    if (na.length >= 2) {
      framework = na[0]
      logger.info(`Setting UI framework to "${framework}"`)
    }
  }
  cardTypes[card.name] = card
}

export function registerMetacard(registerCard: RegisterCardF) {
  function f<C>(declaration: PiRegisterMetaCard) {
    const { type, mapper, events } = declaration
    if (metacardTypes[type]) {
      logger.warn(`Overwriting definition for meta card type "${type}"`)
    }
    logger.info(`Register meta card type "${type}"`)
    metacardTypes[type] = { type, registerCard, mapper, events }
  }
  return f
}

export function registerCard(
  registerReducer: PiRegisterReducerF,
  dispatchF: React.Dispatch<any>,
) {
  // to be used by dynamically registered cards
  dispatch2registerReducer.push([dispatchF, registerReducer])
  return (name: string, parameters: PiCardDef): PiCardRef => {
    return _registerCard(name, parameters, registerReducer)
  }
}

function _registerCard(
  name: string,
  parameters: PiCardDef,
  registerReducer: PiRegisterReducerF,
  overrideEvents?: { [key: string]: string },
): PiCardRef {
  if (cardMappings[name]) {
    logger.warn(`Overwriting definition for card "${name}"`)
  }
  let cardType = cardTypes[parameters.cardType]
  if (!cardType) {
    if (framework) {
      cardType = cardTypes[`${framework}/${parameters.cardType}`]
    }
    if (!cardType) {
      // maybe it's a metadata card
      if (_registerMetadataCard(name, parameters, registerReducer)) {
        return name
      }
      logger.warn("unknown card type", parameters.cardType)
      return name
    }
  }

  const props = {} as { [k: string]: unknown }
  const eventMappers = {} as { [k: string]: (ev: Action) => Action }

  const events = overrideEvents || cardType.events || {}
  Object.entries(parameters).forEach(([k, v]) => {
    if (k === "cardType") return
    if (typeof v === "object") {
      const cd = v as PiCardDef // speculative
      if (cd.cardType) {
        const cardName = `${name}/${k}`
        v = _registerCard(cardName, cd, registerReducer)
      }
    }
    if (
      k.startsWith("on") &&
      processEventParameter(k, v, events, eventMappers, registerReducer, name)
    ) {
      return
    }
    props[k] = v
  })
  cardMappings[name] = { cardType: parameters.cardType, props, eventMappers }
  return name
}

function _registerMetadataCard(
  metaName: string,
  parameters: PiCardDef,
  registerReducer: PiRegisterReducerF,
): boolean {
  let mc = metacardTypes[parameters.cardType]
  if (!mc) {
    if (framework) {
      mc = metacardTypes[`${framework}/${parameters.cardType}`]
    }
    if (!mc) {
      return false
    }
  }
  function registerCard(name: string, parameters: PiCardDef): PiCardRef {
    const n = `${metaName}/${name}`
    return mc.registerCard(n, parameters)
  }
  const top = mc.mapper(metaName, parameters, registerCard)
  _registerCard(metaName, top, registerReducer, mc.events)
  return true
}

export function createCardDeclaration<Props = {}, Events = {}>(
  cardType: string,
): <S extends ReduxState>(p: PiMapProps<Props, S, Events>) => PiCardDef {
  return (p) => ({
    ...p,
    cardType,
  })
}

function processEventParameter(
  propName: string,
  value: unknown,
  events: { [key: string]: string },
  eventMappers: { [k: string]: (ev: Action) => Action },
  registerReducer: PiRegisterReducerF,
  cardName: string,
): boolean {
  const eva = Object.entries(events).filter((e) => propName.startsWith(e[0]))
  if (eva.length === 0) {
    logger.warn(
      `encountered property '${propName}' for card '${cardName}' which looks like an even but is not defined`,
    )
    return false
  }
  // eva could actually return more than one hit if we have similar named events
  let handled = false
  for (const [evName, actionType] of eva) {
    if (propName === evName) {
      const r = value as (state: ReduxState, action: CardAction, dispatch: DispatchF) => ReduxState
      registerReducer(actionType, (s, a, d) => {
        const ca = a as CardAction
        if (ca.cardID === cardName) {
          s = r(s, ca, d)
        }
        return s
      })
      handled = true
      break
    }
    if (propName === `${evName}Mapper`) {
      logger.debug("processEventParameter", cardName)

      const m = value as (ev: Action) => Action
      eventMappers[evName] = m
      handled = true
      break
    }
  }
  return handled
}

export function memo<P, T, S extends ReduxState, C>(
  filterF: (state: S, context: StateMapperContext<C>) => P,
  mapperF: (partial: P, context: StateMapperContext<C>, state: S) => T,
): (state: S, context: StateMapperContext<C>) => T {
  const lastFilter: { [k: string]: P } = {}
  const lastValue: { [k: string]: T } = {}
  const isNotFirst: { [k: string]: boolean } = {}

  return (state: S, context: StateMapperContext<C>): T => {
    const k = context.cardKey || "-"
    const fv = filterF(state, context)
    if (fv === lastFilter[k] && isNotFirst[k]) {
      // nothing changed
      return lastValue[k]
    }
    lastFilter[k] = fv
    const v = mapperF(fv, context, state)
    lastValue[k] = v
    isNotFirst[k] = true
    return v
  }
}

// export type CardProp = {
//   cardName: PiCardRef
// } & { [k: string]: any }

type CompProps = { [k: string]: any }
type CardInfo = {
  mapping: Mapping
  cardType: PiRegisterComponent
}

export function Card(props: CardProp): JSX.Element {
  let cardName: string

  const [id, _] = React.useState<number>(Math.floor(Math.random() * 10000))
  const dispatch = useDispatch() // never change the order of hooks called

  if (typeof props.cardName === "string") {
    cardName = props.cardName
  } else {
    // lets fix it
    cardName = checkForAnonymousCard(props, id, dispatch)
  }
  if (cardName === "") {
    logger.error("card name is not of type string", props.cardName)
    return ErrorCard(<div>Unknown type of cardName '{`${props.cardName}`}'</div>)
  }

  const [info, errCard] = getCardInfo(cardName)
  if (errCard) {
    return ErrorCard(errCard)
  }
  if (!info) {
    throw new Error("info is empty, should never happen")
  }
  return GenericCard(cardName, props, info, id)
}

function checkForAnonymousCard(props: any, id: number, dispatch: Dispatch<AnyAction>): string {
  // const [id, _] = React.useState<number>(Math.floor(Math.random() * 10000))
  // const dispatch = useDispatch() // never change the order of hooks called

  const cardType = props.cardName?.cardType
  if (!cardType) {
    return "" // not sure what that is
  }
  // looks like a potentially unregistered card
  let cardName: string
  if (props.parentCard) {
    cardName = `${props.parentCard}/${cardType.split('/').pop()}`
  } else {
    cardName = cardType
  }
  if (props.cardKey) {
    cardName = `${cardName}#${props.cardKey}-${id}`
  } else {
    cardName = `${cardName}#${id}`
  }
  logger.debug("anonymous", cardName)

  const mapping = cardMappings[cardName]
  if (mapping) {
    // looks like we already processed it
    return cardName
  }
  const parameters = props.cardName as PiCardDef
  const el = dispatch2registerReducer.find(([d, _]) => d === dispatch)
  if (!el) {
    logger.warn("unexpected missing mapping between dispatcher and reducerF")
    return ""
  }
  const regRed = el[1]
  _registerCard(cardName, parameters, regRed)
  return cardName
}

function GenericCard(cardName: string, props: CardProp, info: CardInfo, id: number) {
  const cardProps = useSelector<ReduxState, CompProps>(
    (s) => getCardProps(cardName, s, props, info?.mapping),
    propEq,
  )
  const dispatch = useDispatch()

  const extCardProps = appendEventHandlers(info, cardProps, cardName, dispatch)
  extCardProps._cls = cls_f(cardName, info.mapping.cardType)
  return React.createElement(info.cardType.component, extCardProps, null)
}

const EmptyCompProps = {} as CompProps

function ErrorCard(el: JSX.Element) {
  // Note: call the EXACT same hooks as 'GenericCard'
  useSelector<ReduxState, CompProps>((s) => EmptyCompProps, (a, b) => false)
  useDispatch()
  return el
}


function getCardInfo(cardName: string): [CardInfo?, JSX.Element?] {
  const mapping = cardMappings[cardName]
  if (!mapping) {
    return [undefined, renderUnknownCard(cardName)]
  }
  let cardType = cardTypes[mapping.cardType]
  if (!cardType) {
    if (framework) {
      cardType = cardTypes[`${framework}/${mapping.cardType}`]
    }
    if (!cardType) {
      return [undefined, renderUnknownCardType(mapping.cardType)]
    }
  }
  const info = { mapping, cardType }
  return [info, undefined]
}


function getCardProps(
  cardName: string,
  state: ReduxState,
  props: CardProp,
  mapping: Mapping,
): CompProps {
  const ctxt: StateMapperContext<unknown> = {
    cardName,
    cardKey: props.cardKey,
    ctxtProps: props,
  }
  const init: CompProps = {
    cardName,
    cardKey: props.cardKey,
  }
  const cprops = Object.entries(mapping.props).reduce((p, [key, vf]) => {
    let v = vf
    if (typeof vf === "function") {
      const f = vf as StateMapper<unknown, ReduxState, any>
      v = f(state, ctxt)
    }
    p[key] = v
    return p
  }, init)
  return cprops
}

function cls_f(
  cardName: string,
  cardComp: string,
  prefix: string = "pi",
): (nodeName: string | string[], styles?: CSSModuleClasses) => string {
  const cn = cardName.replaceAll(/[/:]/g, "_")
  const cp = cardComp.replaceAll(/[/:]/g, "_")
  return (nodeName: string | string[], styles?: CSSModuleClasses): string => {
    const na: string[] = typeof nodeName === "string" ? [nodeName] : nodeName
    const ca = [] as string[]
    na.forEach((n) => {
      const s = styles?.[n]
      if (s) ca.push(s)

      const nn = n.replaceAll(/[/:]/g, "_")
      ca.push(`${prefix}-${cn}-${nn}`)
      ca.push(`${prefix}-${cp}-${nn}`)
    })
    return ca.join(" ")
  }
}

function propEq(oldP: CompProps, newP: CompProps): boolean {
  let result = true
  for (const [k, v] of Object.entries(newP)) {
    const ov = oldP[k]
    if (ov !== v) {
      // two empty arrays are considered to be different, but we don't agree :)
      if (!(Array.isArray(v) && !v.length && Array.isArray(ov) && !ov.length)) {
        result = false
        break
      }
    }
  }
  RegisterCardState.changed(newP.cardName, result, newP)
  return result
}

function appendEventHandlers(
  info: CardInfo,
  cardProps: CompProps,
  cardName: string,
  dispatch: Dispatch<Action>,
): CompProps {
  RegisterCardState.props(cardName, cardProps, dispatch)
  const cp: CompProps = {
    ...cardProps,
    _dispatch: (a: AnyAction) => dispatch(a)
  }

  const events = info.cardType?.events
  if (!events) {
    return cp
  }
  const eventMappers = info.mapping.eventMappers
  Object.entries(events).forEach(([name, actionType]) => {
    const m = eventMappers[name]
    if (m) {
      logger.debug("setup mapper", cardName)
      cp[name] = (a: AnyAction) => {
        a.cardID = cardName
        const a2 = m(a)
        if (a2) dispatch(a2)
      }
    } else {
      cp[name] = (a: AnyAction) => {
        a.type = actionType
        a.cardID = cardName
        dispatch(a)
      }
    }
  })
  return cp
}

function renderUnknownCard(cardName: string): JSX.Element {
  return <div>Unknown card '{cardName}'</div>
}

function renderUnknownCardType(cardType: string): JSX.Element {
  return <div>Unknown card type '{cardType}'</div>
}

// Adding card state to redux state for debugging

export const UPDATE_STATE_ACTION = "pi/card/update_state"

type CardState = {
  props: (
    cardName: string,
    cardProps: CompProps,
    dispatch: Dispatch<Action>,
  ) => void
  changed: (cardName: string, isUnchanged: boolean, props: CompProps) => void
  reducer: (state: ReduxState, action: Action) => ReduxState
}

export const RegisterCardState = createCardState()

function createCardState(): CardState {
  type S = {
    cardProps?: CompProps
    changedAt: number
    reportedAt: number
  }
  const s: { [name: string]: S } = {}
  let dispatch: Dispatch<Action>
  let timer: number
  let lastReport = 0

  // const timer
  const getS = (cardName: string, props: CompProps): S => {
    const name = cardName
    let e = s[name]
    if (!e) {
      const ts = Date.now()
      e = {
        changedAt: ts,
        reportedAt: ts,
      } as S
      s[name] = e
      resetTimer()
    }
    return e
  }
  const resetTimer = () => {
    if (timer) {
      clearTimeout(timer)
    }
    timer = window.setTimeout(() => {
      //logger.debug("... timer went off") // , s, dispatch)
      if (dispatch) {
        const changed = Object.values(s).filter((s) => s.changedAt > lastReport)
        if (changed.length > 0) {
          clearTimeout(timer) // just in case
          dispatch({ type: UPDATE_STATE_ACTION })
        }
      }
    }, 1000)
  }
  const props = (
    cardName: string,
    cardProps: CompProps,
    _dispatch: Dispatch<Action>,
  ) => {
    const e = getS(cardName, cardProps)
    e.cardProps = cardProps
    dispatch = _dispatch
  }
  const changed = (cardName: string, isUnchanged: boolean, props: CompProps) => {
    const e = getS(cardName, props)
    e.reportedAt = Date.now()
    if (!isUnchanged) {
      logger.debug("card has changed:", cardName)
      e.changedAt = Date.now()
      resetTimer()
    }
  }
  const reducer = (state: ReduxState): ReduxState => {
    const pi = Object.values(s)
      .filter((s) => s.reportedAt > lastReport)
      .reduce((p, s) => {
        const cname = s.cardProps?.cardName
        if (!cname) {
          logger.warn("Unexpected missing card name", s)
          return p
        }
        const name = cname
        const props = copySafeProps(s.cardProps || {})
        delete props.cardName
        delete props._cls
        p[name] = props
        return p
      }, {} as { [k: string]: any })
    state.pihanga = pi
    lastReport = Date.now()
    return state
  }
  return { props, changed, reducer }
}

function copySafeProps(props: CompProps): CompProps {
  return Object.entries(props).reduce((p, [k, v]) => {
    // const ok = (typeof v === 'undefined' || typeof v === 'string' || typeof v === 'boolean' || typeof v === 'number' || Array.isArray(v));
    const sv = makeSafe(v)
    p[k] = sv
    return p
  }, {} as CompProps)
}

function makeSafe(v: any): any {
  const t = typeof v
  if (t === 'undefined' || t === 'string' || t === 'boolean' || t === 'number') {
    return v
  }
  if (t === 'function') {
    return "f(...)"
  }
  if (Array.isArray(v)) {
    return v.map(makeSafe)
  }
  if (t === 'object') {
    return Object.entries(v).reduce((p, [k, v]) => {
      p[k] = makeSafe(v)
      return p
    }, {} as { [k: string]: any })
  }
  logger.warn(">>> reject", v, typeof v)
  return "..."
}
