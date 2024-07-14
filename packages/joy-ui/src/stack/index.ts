import { PiRegister, createCardDeclaration } from "@pihanga2/core"
import { StackProps } from "@pihanga2/cards/src/stack"

import { Component } from "./stack.component"

export const CARD_TYPE = "joy/stack"
export const JyStack = createCardDeclaration<StackProps>(CARD_TYPE)

export function init(register: PiRegister): void {
  register.cardComponent({
    name: CARD_TYPE,
    component: Component,
  })
}
