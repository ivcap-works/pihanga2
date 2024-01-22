import {
  PiRegister,
  createCardDeclaration,
  actionTypesToEvents,
} from "@pihanga/core"

import { AccoridonComponent } from "./accordion.component"
import {
  type AccordionProps,
  type ComponentEvents,
  ACTION_TYPES,
} from "@pihanga/cards/dist/types/accordion"

export const CARD_TYPE = "joy/accordion"
export const JyAccordion = createCardDeclaration<
  AccordionProps,
  ComponentEvents
>(CARD_TYPE)

export function init(register: PiRegister): void {
  register.cardComponent({
    name: CARD_TYPE,
    component: AccoridonComponent,
    events: actionTypesToEvents(ACTION_TYPES),
  })
}
