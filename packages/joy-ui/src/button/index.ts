import {
  PiRegister,
  createCardDeclaration,
  actionTypesToEvents,
} from "@pihanga/core"

import { Component } from "./button.component"
import {
  ACTION_TYPES,
  type ButtonProps,
  type ComponentEvents,
} from "@pihanga/cards/dist/types/button"

const CARD_TYPE = "joy/button"
export const JyButton = createCardDeclaration<ButtonProps, ComponentEvents>(
  CARD_TYPE,
)

export function init(register: PiRegister): void {
  register.cardComponent({
    name: CARD_TYPE,
    component: Component,
    events: actionTypesToEvents(ACTION_TYPES),
  })
}
