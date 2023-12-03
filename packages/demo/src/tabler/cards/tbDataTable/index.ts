import {
  PiRegister,
  registerActions,
  actionTypesToEvents,
  createOnAction,
  createCardDeclaration,
} from "@pihanga/core"
import { Component } from "./datatable.component"
import type {
  ComponentProps,
  ComponentEvents,
  ToggleEvent,
  PagingEvent,
  HideDetailEvent,
  RowSelectEvent,
  ShowDetailEvent,
  ButtonEvent,
  ColSortEvent,
} from "./datatable.component"

export type {
  Column,
  Row,
  DetailContext,
  ButtonEvent as TbDataTableButtonEvent,
} from "./datatable.component"
export { ColumnType } from "./datatable.component"

const CARD_TYPE = "tb/datatable"

export const TbDataTable = createCardDeclaration<
  ComponentProps,
  ComponentEvents
>(CARD_TYPE)

export const ACTION_TYPES = registerActions(CARD_TYPE, [
  "row_select",
  "column_sort",
  "show_detail",
  "hide_detail",
  "next_page",
  "prev_page",
  "button_clicked",
  "checkbox_clicked",
])
export const onRowSelect = createOnAction<RowSelectEvent>(
  ACTION_TYPES.ROW_SELECT,
)
export const onColumnSort = createOnAction<ColSortEvent>(
  ACTION_TYPES.COLUMN_SORT,
)
export const onShowDetail = createOnAction<ShowDetailEvent<any>>(
  ACTION_TYPES.SHOW_DETAIL,
)
export const onHideDetail = createOnAction<HideDetailEvent<any>>(
  ACTION_TYPES.HIDE_DETAIL,
)
export const onButtonClicked = createOnAction<ButtonEvent<any>>(
  ACTION_TYPES.BUTTON_CLICKED,
)
export const onCheckboxClicked = createOnAction<ToggleEvent<any>>(
  ACTION_TYPES.CHECKBOX_CLICKED,
)
export const onNextPage = createOnAction<PagingEvent>(ACTION_TYPES.NEXT_PAGE)
export const onPreviousPage = createOnAction<PagingEvent>(
  ACTION_TYPES.PREV_PAGE,
)

export function init(register: PiRegister): void {
  register.cardComponent({
    name: CARD_TYPE,
    component: Component,
    events: actionTypesToEvents(ACTION_TYPES),
  })
}

// const TB_DATA_TABLE_CT = "TbXLDataTable"

// type CardProps<S, D> = PiMapProps<ComponentProps<D>, S>
// export function TbXlDataTable<S, D = { [k: string]: any }>(
//   p: CardProps<S, D>,
// ): PiCardDef {
//   return {
//     ...p,
//     cardType: TB_DATA_TABLE_CT,
//   }
// }

// export const ACTION_TYPES = registerActions("TBDTABLE", [
//   "ROW_SELECT",
//   "COLUMN_SORT",
//   "SHOW_DETAIL",
//   "HIDE_DETAIL",
//   "NEXT_PAGE",
//   "PREV_PAGE",
//   "BUTTON_CLICKED",
//   "CHECKBOX_CLICKED",
// ])


// export function init(register: PiRegister): void {
//   register.cardComponent({
//     name: TB_DATA_TABLE_CT,
//     component: Component,
//     events: actionTypesToEvents(ACTION_TYPES),
//   })
// }
