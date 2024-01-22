import {
  PiRegister,
  actionTypesToEvents,
  ReduxState,
  PiMapProps,
  PiCardDef,
} from "@pihanga/core"

import { Component } from "./table.component"
import {
  type TableEvents,
  type TableProps,
  TABLE_ACTION,
} from "@pihanga/cards/src/types/table"

// not a type, need to export it as a non-type as well
export { TableColumnTypeE, chipColumnF } from "@pihanga/cards/src/types/table"

const CARD_TYPE = "joy/table"

export function JyTable<T>(): <S extends ReduxState>(
  p: PiMapProps<TableProps<T>, S, TableEvents>,
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
    events: actionTypesToEvents(TABLE_ACTION),
  })
}
