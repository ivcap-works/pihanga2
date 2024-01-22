import { PiRegister, createCardDeclaration } from "@pihanga/core"
import { SpinnerProps } from "@pihanga/cards/src/spinner"
import { SpinnerComponent } from "./spinner.component"

export const SPINNER_TYPE = "joy/spinner"
export const Spinner = createCardDeclaration<SpinnerProps>(SPINNER_TYPE)

export function init(register: PiRegister): void {
  register.cardComponent({
    name: SPINNER_TYPE,
    component: SpinnerComponent,
  })
}
