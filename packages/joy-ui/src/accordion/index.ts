import {
  PiRegister,
  createCardDeclaration,
  actionTypesToEvents,
} from "@pihanga/core"

import { AccoridonComponent } from "./accordion.component"
import {
  type AccordionProps,
  type ImageViewerEvents,
  ACCORDION_ACTION,
} from "@pihanga/cards/src"

export type { AccordionSX } from "./accordion.component"
export { DEF_ACCORDION_ITEM } from "./accordion.component"

export const ACCORDION_TYPE = "joy/accordion"
export const JyAccordion = createCardDeclaration<
  AccordionProps,
  ImageViewerEvents
>(ACCORDION_TYPE)

export function init(register: PiRegister): void {
  register.cardComponent({
    name: ACCORDION_TYPE,
    component: AccoridonComponent,
    events: actionTypesToEvents(ACCORDION_ACTION),
  })
}
