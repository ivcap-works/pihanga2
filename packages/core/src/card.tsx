import React from 'react'
import { useDispatch, useSelector } from "react-redux"

import { getLogger } from "./logger"
import {
  CSSModuleClasses,
  CardAction,
  CardProp,
  DispatchF,
  PiCardDef,
  PiCardRef,
  PiMapProps,
  PiRegisterComponent,
  PiRegisterReducerF,
  ReduxState,
  StateMapper,
  StateMapperContext,
} from "./types"
import { Action, AnyAction, Dispatch } from "@reduxjs/toolkit"

type Mapping = {
  cardType: string
  props: { [k: string]: unknown }
  eventMappers: { [k: string]: (ev: Action) => Action }
}

const cardTypes: { [k: string]: PiRegisterComponent } = {}
const cardMappings: { [k: string]: Mapping } = {}

const logger = getLogger("card")

export function registerCardComponent(card: PiRegisterComponent): void {
  if (cardTypes[card.name]) {
    logger.warn(`Overwriting definition for card type "${card.name}"`)
  }
  logger.info(`Register card type "${card.name}"`)
  cardTypes[card.name] = card
}

export function registerCard(registerReducer: PiRegisterReducerF) {
  function f(name: string, parameters: PiCardDef): PiCardRef {
    if (cardMappings[name]) {
      logger.warn(`Overwriting definition for card "${name}"`)
    }
    const cardType = cardTypes[parameters.cardType]
    if (!cardType) {
      logger.warn("unknown card type", parameters.cardType)
      return name
    }

    const props = {} as { [k: string]: unknown }
    const eventMappers = {} as { [k: string]: (ev: Action) => Action }

    const events = cardType.events || {}
    Object.entries(parameters).forEach(([k, v]) => {
      if (k === "cardType") return
      if (typeof v === "object") {
        const cd = v as PiCardDef // speculative
        if (cd.cardType) {
          const cardName = `${name}:${k}`
          v = f(cardName, cd)
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
  return f
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
  let lastFilter: P
  let lastValue: T

  return (state: S, context: StateMapperContext<C>): T => {
    const fv = filterF(state, context)
    if (fv === lastFilter) {
      // nothing changed
      return lastValue
    }
    lastFilter = fv
    lastValue = mapperF(fv, context, state)
    return lastValue
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
  if (typeof props.cardName !== "string") {
    logger.error("card name is not of type string", props.cardName)
    return <div>Unknown type of cardName '{`${props.cardName}`}'</div>
  }
  const { cardName } = props

  const [info, errCard] = getCardInfo(cardName)
  if (errCard) {
    return errCard
  }
  if (!info) {
    throw new Error("info is empty, should never happen")
  }
  return GenericCard(cardName, props, info)
}

function GenericCard(cardName: string, props: CardProp, info: CardInfo) {
  const cardProps = useSelector<ReduxState, CompProps>(
    (s) => getCardProps(cardName, s, props, info?.mapping),
    propEq,
  )
  const dispatch = useDispatch()

  const extCardProps = appendEventHandlers(info, cardProps, cardName, dispatch)
  extCardProps._cls = cls_f(cardName, info.mapping.cardType)
  return React.createElement(info.cardType.component, extCardProps, null)
}

function getCardInfo(cardName: string): [CardInfo?, JSX.Element?] {
  const mapping = cardMappings[cardName]
  if (!mapping) {
    return [undefined, renderUnknownCard(cardName)]
  }
  const cardType = cardTypes[mapping.cardType]
  if (!cardType) {
    return [undefined, renderUnknownCardType(mapping.cardType)]
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
    ctxtProps: props,
  }
  const init: CompProps = {
    cardName,
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
    if (oldP[k] !== v) {
      result = false
      break
    }
  }
  RegisterCardState.changed(newP.cardName, result)
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
      cp[name] = (a: AnyAction) => {
        a.cardID = cardName
        const a2 = m(a)
        dispatch(a2)
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
  changed: (cardName: string, isUnchanged: boolean) => void
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
  const getS = (cardName: string): S => {
    let e = s[cardName]
    if (!e) {
      const ts = Date.now()
      e = {
        changedAt: ts,
        reportedAt: ts,
      } as S
      s[cardName] = e
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
    const e = getS(cardName)
    e.cardProps = cardProps
    dispatch = _dispatch
  }
  const changed = (cardName: string, isUnchanged: boolean) => {
    const e = getS(cardName)
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
        const name = s.cardProps?.cardName
        const props = { ...s.cardProps }
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
