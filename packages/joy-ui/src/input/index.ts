import {
  PiRegister,
  createCardDeclaration,
  actionTypesToEvents,
} from "@pihanga2/core"

import { InputComponent } from "./input.component"
import {
  type InputProps,
  INPUT_ACTION,
  INPUT_CARD,
  InputEvents,
} from "@pihanga2/cards"

const JY_INPUT_CARD = "joy/" + INPUT_CARD
export const JyInput = createCardDeclaration<InputProps, InputEvents>(
  JY_INPUT_CARD,
)

export function inputInit(register: PiRegister): void {
  register.cardComponent({
    name: JY_INPUT_CARD,
    component: InputComponent,
    events: actionTypesToEvents(INPUT_ACTION),
  })
}
