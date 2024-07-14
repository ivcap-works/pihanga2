import {
  PiRegister,
  createCardDeclaration,
  actionTypesToEvents,
} from "@pihanga2/core"

import { Component } from "./formInput.component"
import {
  FORM_INPUT_ACTION,
  FormInputEvents,
  FormInputProps,
} from "@pihanga2/cards"

export const FORM_INPUT_CARD = "joy/formInput"
export const JyFormInput = createCardDeclaration<
  FormInputProps,
  FormInputEvents
>(FORM_INPUT_CARD)

export function init(register: PiRegister): void {
  register.cardComponent({
    name: FORM_INPUT_CARD,
    component: Component,
    events: actionTypesToEvents(FORM_INPUT_ACTION),
  })
}
