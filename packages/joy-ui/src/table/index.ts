import {
  PiRegister,
  actionTypesToEvents,
  ReduxState,
  PiMapProps,
  PiCardDef,
  createCardDeclaration,
} from "@pihanga2/core"

import { Component } from "./table.component"
import {
  type TableEvents,
  type TableProps,
  TABLE_ACTION,
} from "@pihanga2/cards"

// not a type, need to export it as a non-type as well
export type { TableSX } from "./table.component"
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
