import {
  PiRegister,
  createCardDeclaration,
  actionTypesToEvents,
} from "@pihanga2/core"

import { Component } from "./link.component"
import { type LinkProps, type LinkEvents, LINK_ACTIONS } from "@pihanga2/cards"

export const JY_LINK_CARD = "joy/link"
export const JyLink = createCardDeclaration<LinkProps, LinkEvents>(JY_LINK_CARD)

export function init(register: PiRegister): void {
  register.cardComponent({
    name: JY_LINK_CARD,
    component: Component,
    events: actionTypesToEvents(LINK_ACTIONS),
  })
}
