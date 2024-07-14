import { PiRegister, createCardDeclaration } from "@pihanga2/core"

import { Component } from "./card.component"
import type { ComponentProps } from "./card.component"

export const CARD_CARD_TYPE = "joy/card"
export const JyCard = createCardDeclaration<ComponentProps>(CARD_CARD_TYPE)

export function init(register: PiRegister): void {
  register.cardComponent({
    name: CARD_CARD_TYPE,
    component: Component,
  })
}
