import { PiRegister, createCardDeclaration } from "@pihanga2/core"

import { BoxComponent } from "./box.component"
import { BoxProps } from "@pihanga2/cards"

export const BOX_CARD = "joy/box"
export const JyBox = createCardDeclaration<BoxProps>(BOX_CARD)

export function init(register: PiRegister): void {
  register.cardComponent({
    name: BOX_CARD,
    component: BoxComponent,
  })
}
