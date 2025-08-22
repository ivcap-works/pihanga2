import {
  PiRegister,
  createCardDeclaration,
  actionTypesToEvents,
} from "@pihanga2/core"

import { Component } from "./chip.component"
import { type ChipProps, CHIP_ACTION } from "@pihanga2/cards"

const CARD_TYPE = "joy/chip"
export const JyChip = createCardDeclaration<ChipProps>(CARD_TYPE)

export function init(register: PiRegister): void {
  register.cardComponent({
    name: CARD_TYPE,
    component: Component,
    events: actionTypesToEvents(CHIP_ACTION),
  })
}
