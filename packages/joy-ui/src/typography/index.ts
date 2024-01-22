import { PiRegister, createCardDeclaration } from "@pihanga/core"

import { TypographyComponent } from "./typography.component"
import type { TypographyProps } from "@pihanga/cards/src/types/typography"

export const CARD_TYPE = "joy/typography"
export const JyTypography = createCardDeclaration<TypographyProps>(CARD_TYPE)

export function init(register: PiRegister): void {
  register.cardComponent({
    name: CARD_TYPE,
    component: TypographyComponent,
  })
}
