import { PiRegister, WindowProps, createCardDeclaration } from "@pihanga2/core"

import { Component } from "./framework.component"

const CARD_TYPE = "joy/framework"
export const JyFramework = createCardDeclaration<WindowProps>(CARD_TYPE)

export function init(register: PiRegister): void {
  register.cardComponent({
    name: CARD_TYPE,
    component: Component,
  })
}
