import {
  PiRegister,
  createCardDeclaration,
  actionTypesToEvents,
} from "@pihanga2/core"

import { Component, type ComponentProps } from "./list.component"
import { LIST_ACTION, ListEvents } from "@pihanga2/cards"

export const CARD_TYPE = "joy/list"
export const JyList = createCardDeclaration<ComponentProps, ListEvents>(
  CARD_TYPE,
)

export function init(register: PiRegister): void {
  register.cardComponent({
    name: CARD_TYPE,
    component: Component,
    events: actionTypesToEvents(LIST_ACTION),
  })
}
