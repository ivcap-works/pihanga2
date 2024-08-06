import { PiRegister, createCardDeclaration } from "@pihanga2/core"

import { Component } from "./pageD1.component"
import type { PageD1Props } from "@pihanga2/cards"

const PAGE_D1_CARD = "joy/pageD1"
export const JyPage1 = createCardDeclaration<PageD1Props>(PAGE_D1_CARD)

export function init(register: PiRegister): void {
  register.cardComponent({
    name: PAGE_D1_CARD,
    component: Component,
  })
}
