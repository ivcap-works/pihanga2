import {
  PiRegister,
  createCardDeclaration,
  actionTypesToEvents,
} from "@pihanga2/core"

import { Component } from "./sidebar.component"
import {
  type SidebarProps,
  type SidebarEvents,
  SIDEBAR_ACTION,
} from "./sidebar.types"

export * from "./sidebar.types"

export const JY_SIDEBAR_TYPE = "joy/sidebar"
export const JySidebar = createCardDeclaration<SidebarProps, SidebarEvents>(
  JY_SIDEBAR_TYPE,
)

export function init(register: PiRegister): void {
  register.cardComponent({
    name: JY_SIDEBAR_TYPE,
    component: Component,
    events: actionTypesToEvents(SIDEBAR_ACTION),
  })
}
