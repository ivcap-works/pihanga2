import {
  createCardDeclaration,
  createOnAction,
  PiCardRef,
  registerActions,
} from "@pihanga2/core"

export const CLICK_AWAY_LISTENER_CARD = "clickAwayListener"
export const ClickAwayListener = createCardDeclaration<
  ClickAwayListenerProps,
  ClickAwayListenerEvents
>(CLICK_AWAY_LISTENER_CARD)

export const CLICK_AWAY_LISTENER_ACTION = registerActions(
  CLICK_AWAY_LISTENER_CARD,
  ["clicked"],
)

export const onClickAway = createOnAction<ClickAwayEvent>(
  CLICK_AWAY_LISTENER_ACTION.CLICKED,
)

// one of the two paramters need to be defined
export type ClickAwayListenerProps = {
  content?: PiCardRef
  child?: JSX.Element
}

export type ClickAwayEvent = {}

export type ClickAwayListenerEvents = {
  onClicked: ClickAwayEvent
}
