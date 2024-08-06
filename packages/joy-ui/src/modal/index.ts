import {
  PiRegister,
  actionTypesToEvents,
  createCardDeclaration,
} from "@pihanga2/core"
import { MODAL_ACTION, ModalEvents, type ModalProps } from "@pihanga2/cards"
import { ModalComponent } from "./modal.component"

export const CARD_TYPE = "joy/modal"
export const JyList = createCardDeclaration<ModalProps, ModalEvents>(CARD_TYPE)

export function init(register: PiRegister): void {
  register.cardComponent({
    name: CARD_TYPE,
    component: ModalComponent,
    events: actionTypesToEvents(MODAL_ACTION),
  })
}
