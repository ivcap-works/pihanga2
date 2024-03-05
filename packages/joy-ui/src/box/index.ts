import { PiRegister, createCardDeclaration } from "@pihanga2/core"

import { Component } from "./box.component"
import type { ComponentProps } from "./box.types"

export const CARD_TYPE = "joy/box"
export const JyBox = createCardDeclaration<ComponentProps>(CARD_TYPE)

export function init(register: PiRegister): void {
  register.cardComponent({
    name: CARD_TYPE,
    component: Component,
  })
}
