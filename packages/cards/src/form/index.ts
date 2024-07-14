import { PiRegister, actionTypesToEvents } from "@pihanga2/core"

import { FormComponent } from "./form.component"
import { FORM_ACTION, FORM_CARD } from "./form.types"

export * from "./form.types"

export function formInit(register: PiRegister): void {
  register.cardComponent({
    name: FORM_CARD,
    component: FormComponent,
    events: actionTypesToEvents(FORM_ACTION),
  })
}
