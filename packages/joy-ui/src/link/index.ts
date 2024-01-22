import {
  PiRegister,
  createCardDeclaration,
  actionTypesToEvents,
} from "@pihanga/core"

import { Component } from "./link.component"
import {
  type LinkProps,
  type ComponentEvents,
  ACTION_TYPES,
} from "@pihanga/cards/src/types/link"

export const CARD_TYPE = "joy/link"
export const JyLink = createCardDeclaration<LinkProps, ComponentEvents>(
  CARD_TYPE,
)

export function init(register: PiRegister): void {
  register.cardComponent({
    name: CARD_TYPE,
    component: Component,
    events: actionTypesToEvents(ACTION_TYPES),
  })
}
