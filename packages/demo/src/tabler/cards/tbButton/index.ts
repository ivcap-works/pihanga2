import {
  registerActions,
  PiRegister,
  createCardDeclaration,
  createOnAction,
  actionTypesToEvents,
} from "@pihanga/core"

import { Component } from "./tbButton.component"
import type { ComponentProps, ButtonClickedEvent } from "./tbButton.component"

export const CARD_TYPE = "tb/button"
export const TbButton = createCardDeclaration<ComponentProps>(CARD_TYPE)

export const ACTION_TYPES = registerActions(CARD_TYPE, ["clicked"])

export const onClicked = createOnAction<ButtonClickedEvent>(
  ACTION_TYPES.CLICKED,
)

export function init(register: PiRegister): void {
  register.cardComponent({
    name: CARD_TYPE,
    component: Component,
    events: actionTypesToEvents(ACTION_TYPES),
  })
}
