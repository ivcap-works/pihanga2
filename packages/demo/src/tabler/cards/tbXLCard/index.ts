import { PiRegister, createCardDeclaration } from "@pihanga/core"
import { Component } from "./tbXLCard.component"
import type { ComponentProps } from "./tbXLCard.component"

export const CARD_TYPE = "tb/xlcard"
export const TbXlCard = createCardDeclaration<ComponentProps>(CARD_TYPE)

export function init(register: PiRegister): void {
  register.cardComponent({
    name: CARD_TYPE,
    component: Component,
  })
}
