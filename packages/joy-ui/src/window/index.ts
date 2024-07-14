import { PiRegister, createCardDeclaration } from "@pihanga2/core"

import { Component } from "./window.component"
import type { WindowProps } from "./window.type"

export const JY_WINDOW_TYPE = "joy/window"
export const JyWindow = createCardDeclaration<WindowProps>(JY_WINDOW_TYPE)

export function init(register: PiRegister): void {
  register.cardComponent({
    name: JY_WINDOW_TYPE,
    component: Component,
  })
}
