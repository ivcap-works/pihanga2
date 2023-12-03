import {
  PiRegister,
  actionTypesToEvents,
  createCardDeclaration,
  createOnAction,
  registerActions,
} from "@pihanga/core"

import { Component } from "./tbCard.component"
import type { ComponentProps } from "./tbCard.component"

import { Component as NavButtonComponent } from "./tbNavButton.component"
import type {
  ButtonClickedEvent,
  ComponentProps as NavButtonComponentProps,
} from "./tbNavButton.component"

export const CARD_TYPE = "tb/card"
export const TbCard = createCardDeclaration<ComponentProps>(CARD_TYPE)

export const NAV_BUTTON_TYPE = "tb/navButton"
export const NB_ACTION_TYPES = registerActions(NAV_BUTTON_TYPE, ["clicked"])

export const TbNavButton =
  createCardDeclaration<NavButtonComponentProps>(NAV_BUTTON_TYPE)
export const onNavBtnClicked = createOnAction<ButtonClickedEvent>(
  NB_ACTION_TYPES.CLICKED,
)

export function init(register: PiRegister): void {
  register.cardComponent({
    name: CARD_TYPE,
    component: Component,
  })

  register.cardComponent({
    name: NAV_BUTTON_TYPE,
    component: NavButtonComponent,
    events: actionTypesToEvents(NB_ACTION_TYPES),
  })
}
