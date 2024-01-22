import {
  PiRegister,
  createCardDeclaration,
  actionTypesToEvents,
} from "@pihanga/core"

import { Component } from "./sidebar.component"
import {
  type SidebarProps,
  type ComponentEvents,
  ACTION_TYPES,
} from "./sidebar.types"

export const CARD_TYPE = "joy/sidebar"
export const JySidebar = createCardDeclaration<SidebarProps, ComponentEvents>(
  CARD_TYPE,
)

export function init(register: PiRegister): void {
  register.cardComponent({
    name: CARD_TYPE,
    component: Component,
    events: actionTypesToEvents(ACTION_TYPES),
  })
}
