import { PiRegister, createCardDeclaration } from "@pihanga2/core"

import { TypographyComponent } from "./typography.component"
import type { TypographyProps } from "@pihanga2/cards"

export const CARD_TYPE = "joy/typography"
export const JyTypography = createCardDeclaration<TypographyProps>(CARD_TYPE)

export function init(register: PiRegister): void {
  register.cardComponent({
    name: CARD_TYPE,
    component: TypographyComponent,
  })
}
