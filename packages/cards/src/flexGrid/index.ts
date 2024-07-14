import { PiRegister } from "@pihanga2/core"

import { FlexGridComponent } from "./flexGrid.component"
import { FLEX_GRID_CARD } from "./flexGrid.types"

export * from "./flexGrid.types"

export function flexGridInit(register: PiRegister): void {
  register.cardComponent({
    name: FLEX_GRID_CARD,
    component: FlexGridComponent,
  })
}
