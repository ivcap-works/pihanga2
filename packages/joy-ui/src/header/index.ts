import {
  PiRegister,
  createCardDeclaration,
  actionTypesToEvents,
} from "@pihanga2/core"

import { Component } from "./header.component"
import {
  ACTION_TYPES,
  type ComponentEvents,
  type HeaderProps,
} from "./header.types"

export const CARD_TYPE = "joy/header"
export const JyHeader = createCardDeclaration<HeaderProps, ComponentEvents>(
  CARD_TYPE,
)

export function init(register: PiRegister): void {
  register.cardComponent({
    name: CARD_TYPE,
    component: Component,
    events: actionTypesToEvents(ACTION_TYPES),
  })
}
