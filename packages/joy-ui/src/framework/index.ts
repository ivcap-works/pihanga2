import { PiRegister, createCardDeclaration } from "@pihanga2/core"

import { Component } from "./framework.component"
import type { ComponentProps } from "./framework.types"

const CARD_TYPE = "joy/framework"
export const JyFramework = createCardDeclaration<ComponentProps>(CARD_TYPE)

export function init(register: PiRegister): void {
  register.cardComponent({
    name: CARD_TYPE,
    component: Component,
  })
}
