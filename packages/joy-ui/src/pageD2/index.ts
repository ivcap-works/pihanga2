import { PiRegister, createCardDeclaration } from "@pihanga2/core"

import { Component } from "./pageD2.component"
import type { PageD2Props } from "@pihanga2/cards"

const PAGE_D2_CARD = "joy/pageD2"
export const JyPage2 = createCardDeclaration<PageD2Props>(PAGE_D2_CARD)

export function init(register: PiRegister): void {
  register.cardComponent({
    name: PAGE_D2_CARD,
    component: Component,
  })
}
