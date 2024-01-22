import { PiRegister, createCardDeclaration } from "@pihanga/core"

import { Component } from "./pageD1.component"
import type { ComponentProps } from "./pageD1.types"

export const CARD_TYPE = "joy/pageD1"
export const JyPage1 = createCardDeclaration<ComponentProps>(CARD_TYPE)

export function init(register: PiRegister): void {
  register.cardComponent({
    name: CARD_TYPE,
    component: Component,
  })
}
