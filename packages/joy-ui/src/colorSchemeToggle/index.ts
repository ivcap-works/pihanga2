import {
  PiRegister,
  createCardDeclaration,
  actionTypesToEvents,
} from "@pihanga2/core"

import { Component, type ComponentProps } from "./colorSchemeToggle.component"
import { type ComponentEvents, ACTION_TYPES } from "./colorSchemeToggle.types"

export const CARD_TYPE = "joy/colorSchemeToggle"
export const JyColorSchemeToggle = createCardDeclaration<ComponentProps, ComponentEvents>(CARD_TYPE)

export function init(register: PiRegister): void {
  register.cardComponent({
    name: CARD_TYPE,
    component: Component,
    events: actionTypesToEvents(ACTION_TYPES),
  })
}
