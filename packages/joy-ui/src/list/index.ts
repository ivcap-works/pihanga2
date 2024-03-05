import {
  PiRegister,
  createCardDeclaration,
  actionTypesToEvents,
} from "@pihanga2/core"

import { Component, type ComponentProps } from "./list.component"
import { ACTION_TYPES, ComponentEvents } from "@pihanga2/cards/src/list"

export const CARD_TYPE = "joy/list"
export const JyList = createCardDeclaration<ComponentProps, ComponentEvents>(
  CARD_TYPE,
)

export function init(register: PiRegister): void {
  register.cardComponent({
    name: CARD_TYPE,
    component: Component,
    events: actionTypesToEvents(ACTION_TYPES),
  })
}
