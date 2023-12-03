import { PiRegister, createCardDeclaration } from "@pihanga/core"
import { Component } from "./tbSpinner.component"
import type { ComponentProps } from "./tbSpinner.component"
export { SpinnerColor, SpinnerSize } from "./tbSpinner.component"

export const CARD_TYPE = "tb/spinner"

export const TbSpinner = createCardDeclaration<ComponentProps>(CARD_TYPE)

export function init(register: PiRegister): void {
  register.cardComponent({
    name: CARD_TYPE,
    component: Component,
  })
}
