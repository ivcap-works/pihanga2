import { PiRegister } from "@pihanga/core"

import { FlexGridComponent } from "./flexGrid.component"
import { FLEX_GRID_TYPE } from "./flexGrid"

export * from "./flexGrid"

export function flexGridInit(register: PiRegister): void {
  register.cardComponent({
    name: FLEX_GRID_TYPE,
    component: FlexGridComponent,
  })
}
