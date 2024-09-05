import { PiRegister, actionTypesToEvents } from "@pihanga2/core"

import { SlateComponent } from "./slate.component"
import { SLATE_ACTION, SLATE_CARD } from "./slate.types"
import { op_init } from "./operations"

export * from "./slate.types"
export { registerCustomElement } from "./elements"
export { registerOP } from "./slate.component"
export * from "./operations"

export function slateInit(register: PiRegister): void {
  op_init()
  register.cardComponent({
    name: SLATE_CARD,
    component: SlateComponent,
    events: actionTypesToEvents(SLATE_ACTION),
  })
}
