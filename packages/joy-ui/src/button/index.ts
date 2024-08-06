import {
  PiRegister,
  createCardDeclaration,
  actionTypesToEvents,
} from "@pihanga2/core"

import { Component } from "./button.component"
import {
  BUTTON_ACTION,
  type ButtonProps,
  type ButtonEvents,
} from "@pihanga2/cards"

const CARD_TYPE = "joy/button"
export const JyButton = createCardDeclaration<ButtonProps, ButtonEvents>(
  CARD_TYPE,
)

export function init(register: PiRegister): void {
  register.cardComponent({
    name: CARD_TYPE,
    component: Component,
    events: actionTypesToEvents(BUTTON_ACTION),
  })
}
