import {
  PiRegister,
  createCardDeclaration,
  actionTypesToEvents,
} from "@pihanga/core"

import { Component } from "./list.component"
import {
  ACTION_TYPES,
  ComponentEvents,
  type ListProps,
} from "@pihanga/cards/dist/types/list"

export const CARD_TYPE = "joy/list"
export const JyList = createCardDeclaration<ListProps, ComponentEvents>(
  CARD_TYPE,
)

export function init(register: PiRegister): void {
  register.cardComponent({
    name: CARD_TYPE,
    component: Component,
    events: actionTypesToEvents(ACTION_TYPES),
  })
}
