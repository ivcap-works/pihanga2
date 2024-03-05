import {
  PiRegister,
  createCardDeclaration,
  actionTypesToEvents,
} from "@pihanga2/core"

import { Component, type ComponentProps } from "./iconButton.component"
import { type ComponentEvents, ACTION_TYPES } from "./iconButton.types"

export const CARD_TYPE = "joy/icon_button"
export const JyIconButton = createCardDeclaration<ComponentProps, ComponentEvents>(CARD_TYPE)


export function init(register: PiRegister): void {
  register.cardComponent({
    name: CARD_TYPE,
    component: Component,
    events: actionTypesToEvents(ACTION_TYPES),
  })
}
