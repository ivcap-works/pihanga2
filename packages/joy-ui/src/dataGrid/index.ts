import {
  PiRegister,
  actionTypesToEvents,
  ReduxState,
  PiMapProps,
  PiCardDef,
} from "@pihanga/core"

import { Component } from "./dataGrid.component"
import {
  type DataGridProps,
  type DataGridEvents,
  DATA_GRID_ACTION,
} from "@pihanga/cards/src/types/dataGrid"

// is not a type, need to additionally export it as a non-type
export { DataGridElTypeE } from "@pihanga/cards/src/types/dataGrid"

const CARD_TYPE = "joy/dataGrid"

export function JyDataGrid<T extends { [k: string]: any }>(): <
  S extends ReduxState,
>(
  p: PiMapProps<DataGridProps<T>, S, DataGridEvents>,
) => PiCardDef {
  return (p) => ({
    ...p,
    cardType: CARD_TYPE,
  })
}

export function init(register: PiRegister): void {
  register.cardComponent({
    name: CARD_TYPE,
    component: Component,
    events: actionTypesToEvents(DATA_GRID_ACTION),
  })
}
