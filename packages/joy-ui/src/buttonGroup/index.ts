import { PiRegister, createCardDeclaration } from "@pihanga/core"

import { Component } from "./buttonGroup.component"
import type { ButtonGroupProps } from "@pihanga/cards/src/types/buttonGroup"

const CARD_TYPE = "joy/button-group"
export const JyButtonGroup = createCardDeclaration<ButtonGroupProps>(CARD_TYPE)

export function init(register: PiRegister): void {
  register.cardComponent({
    name: CARD_TYPE,
    component: Component,
    // events: actionTypesToEvents(ACTION_TYPES),
  })
}
