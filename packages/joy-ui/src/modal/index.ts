import {
  PiRegister,
  actionTypesToEvents,
  createCardDeclaration,
} from "@pihanga2/core"
import {
  ACTION_TYPES,
  ComponentEvents,
  type ModalProps,
} from "@pihanga2/cards/src/modal"
import { ModalComponent } from "./modal.component"

export const CARD_TYPE = "joy/modal"
export const JyList = createCardDeclaration<ModalProps, ComponentEvents>(
  CARD_TYPE,
)

export function init(register: PiRegister): void {
  register.cardComponent({
    name: CARD_TYPE,
    component: ModalComponent,
    events: actionTypesToEvents(ACTION_TYPES),
  })
}
