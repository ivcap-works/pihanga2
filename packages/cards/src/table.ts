import {
  PiCardDef,
  PiCardRef,
  PiMapProps,
  ReduxAction,
  ReduxState,
  createOnAction,
  registerActions,
} from "@pihanga2/core"
import { ColorT, DecoratorT, SizeT, VariantT } from "./common"
import { TypographyLevelT } from "./common"

export const CARD_TYPE = "table"

export function Table<T, S extends ReduxState>(): (
  p: PiMapProps<TableProps<T>, S, TableEvents<T>>,
) => PiCardDef {
  return (p) => ({
    ...p,
    cardType: CARD_TYPE,
  })
}

export const TABLE_ACTION = registerActions(CARD_TYPE, [
  "row_clicked",
  "rows_selected",
  "all_rows_selected",
  "column_sort",
  "show_detail",
  "hide_detail",
  "new_page",
  "button_clicked",
  "checkbox_clicked",
])
export const onTableRowClicked = createOnAction<RowClickedEvent>(
  TABLE_ACTION.ROW_CLICKED,
)
export const onTableColumnSort = createOnAction<ColSortEvent>(
  TABLE_ACTION.COLUMN_SORT,
)
export const onTableShowDetail = createOnAction<ShowDetailEvent<any>>(
  TABLE_ACTION.SHOW_DETAIL,
)
export const onTableHideDetail = createOnAction<HideDetailEvent<any>>(
  TABLE_ACTION.HIDE_DETAIL,
)
export const onTableButtonClicked = createOnAction<ButtonEvent<any>>(
  TABLE_ACTION.BUTTON_CLICKED,
)
export const onTableCheckboxClicked = createOnAction<ToggleEvent>(
  TABLE_ACTION.CHECKBOX_CLICKED,
)
export const onTableRowsSelected = createOnAction<RowsSelectedEvent>(
  TABLE_ACTION.ROWS_SELECTED,
)
export const onTableAllRowsSelected = createOnAction<AllRowsSelectedEvent>(
  TABLE_ACTION.CHECKBOX_CLICKED,
)
export const onTableNewPage = createOnAction<PagingEvent>(TABLE_ACTION.NEW_PAGE)

type DEF_ROW_TYPE = { [k: string]: any }

export type TableProps<D = DEF_ROW_TYPE> = {
  columns: GenericColumn[]
  data: TableRow<D>[]
  dataOffset?: number // number of preceeding values not shown

  thisCursor?: string | number // when set indicates that table only shows part of a larger set
  firstCursor?: string | number // when set identifies first "page" of this set
  nextCursor?: string | number // when set refers to next "page" of data
  prevCursor?: string | number // when set refers to previous "page" of data

  rowsClickable?: boolean // set to true if clicking on a row leads to some action
  hideColumnHeaders?: boolean
  dataFormatter?: ColumnDict<TableColumnFormatter>
  hasDetails?: boolean // if true rows could show details
  manageDetails?: boolean // when true internally manage which detail card to show
  showLimit?: number // max number of results to show (might be less than data)
  recordCount?: number // number of records in dataset -1 .. unknown
  showPageSizeSelector?: boolean
  showSearch?: boolean
  showFooter?: boolean
  cardOnEmpty?: PiCardRef // card to display when no items are available
  borderAxis?: BorderAxisT //The axis to display a border on the table cell.
  hoverRow?: boolean //  If true, the table row will shade on hover.
  color?: ColorT
  noWrap?: boolean //  If true, the body cells will not wrap, but instead will truncate with a text overflow ellipsis.
  size?: SizeT // Size of default fonts
  stripe?: StripeT // The odd or even row of the table body will have subtle background color.
  variant?: VariantT
  stickyHeader?: boolean // If true, the header always appear at the bottom of the overflow table.
  stickyFooter?: boolean // If true, the footer always appear at the bottom of the overflow table.
  sheetWrap?: {
    // control enclosing sheet
    notUsed: boolean // don't wrap table in sheet
    variant?: VariantT
  }
}

export type TableColumnFormatter = (el: any, column: TableColumn) => string

export type TableColumn = {
  label: string
  title?: string // if not defined, use capitalised 'label'
  sortable?: boolean
  columnWidth?: number | string
  headerStyle?: React.CSSProperties
  cellStyle?: React.CSSProperties
  valueStyle?: React.CSSProperties
}

// Whenever something is added to ColumnType, also add it to ColumnDict
export enum TableColumnTypeE {
  String = "string",
  Number = "number",
  Boolean = "boolean",
  Date = "date",
  Chip = "chip",
  Progress = "progress",
  Button = "button",
  Toggle = "toggle",
  Icon = "icon",
  Status = "status",
  Hidden = "hidden",
  _Detail = "detail", // internal use only
}

// Can't make [k in ColumnType]:T work for optional (?) values
type ColumnDict<T> = {
  string?: T
  number?: T
  boolean?: T
  date?: T
  chip?: T
  progress?: T
  button?: T
  toggle?: T
  icon?: T
  status?: T
  hidden?: T
}

export type TableRow<T = DEF_ROW_TYPE> = {
  id: string | number
  data: T //{ [k: string]: T };
  detailCard?: PiCardRef
}

export type TableDetailContext<T = DEF_ROW_TYPE> = {
  row: TableRow<T>
}

type _TextColumn = TableColumn & {
  level?: TypographyLevelT
  variant?: VariantT
  textColor?: any
  fontSize?: SizeT | string
  fontWeight?: SizeT | string
}

export type StringColumn = _TextColumn & {
  type: TableColumnTypeE.String
}

export type DetailColumnT = TableColumn & {
  type: TableColumnTypeE._Detail
  // isDetail?: boolean;
}

export const DetailColumn: DetailColumnT = {
  label: "details",
  title: "", // nothing to show in header
  type: TableColumnTypeE._Detail,
  sortable: false,
}

export type NumberColumn = TableColumn & {
  type: TableColumnTypeE.Number
}

export type BooleanColumn = TableColumn & {
  type: TableColumnTypeE.Boolean
}

export type DateColumn = _TextColumn & {
  type: TableColumnTypeE.Date
  dateFormatter?: (d: Date) => string
}

type EnumDictionary<T extends string | symbol | number, U> = {
  [K in T]: U
}

export type ChipColumnBase<E extends string> = TableColumn & {
  startDecorator?: EnumDictionary<E, DecoratorT>
  color: EnumDictionary<E, ColorT>
}

export type ChipColumn<E extends string> = ChipColumnBase<E> & {
  type: TableColumnTypeE.Chip
}

export function chipColumnF<E extends string>(
  p: ChipColumnBase<E>,
): ChipColumn<E> {
  return {
    ...p,
    type: TableColumnTypeE.Chip,
  }
}

export type ProgressColumn = TableColumn & {
  type: TableColumnTypeE.Progress
  variant?: VariantT
  color?: ColorT
}

export type ButtonColumn = TableColumn & {
  type: TableColumnTypeE.Button
  refTitle?: string // when set, take button title from respective row field
  // buttonType?: TbButtonType
}

export type ToggleColumn = TableColumn & {
  type: TableColumnTypeE.Toggle
  selected?: boolean
}

export enum IconType {
  TbIcon = "icon",
  TbIconName = "iconName",
  SVG = "svg",
  ReactComponent = "react",
}

export type IconColumn = TableColumn & {
  type: TableColumnTypeE.Icon
  iconType: IconType
}

export enum Status {
  Pending = "pending",
  Scheduled = "scheduled",
  Executing = "executing",
  Succeeded = "succeeded",
  Failed = "failed",
  Error = "error",
  Unknown = "unknown",
}

export type StatusColumn = TableColumn & {
  type: TableColumnTypeE.Status
  //status: Status;
}

export type HiddenColumn = TableColumn & {
  type: TableColumnTypeE.Hidden
}

export type GenericColumn =
  | StringColumn
  | NumberColumn
  | BooleanColumn
  | DateColumn
  | ChipColumn<any>
  | ProgressColumn
  | ButtonColumn
  | ToggleColumn
  | IconColumn
  | StatusColumn
  | HiddenColumn

export type BorderAxisT =
  // The axis to display a border on the table cell.
  // default: 'xBetween'
  "both" | "bothBetween" | "none" | "x" | "xBetween" | "y" | "yBetween"

export type StripeT =
  // The odd or even row of the table body will have subtle background color.
  "odd" | "even" | string

//*** EVENTS */

export type RowClickedEvent<T = DEF_ROW_TYPE> = {
  row: TableRow<T>
}

export type RowsSelectedEvent<T = DEF_ROW_TYPE> = {
  selected: TableRow<T>[]
}

export type AllRowsSelectedEvent<T = DEF_ROW_TYPE> = {
  except: TableRow<T>[] // rows not selected
}

export type RowEventMapper<T> = <A extends ReduxAction>(row: TableRow<T>) => A

export type ColSortEvent = {
  isAscending: boolean
  col: TableColumn
}

export type DetailEvent<T = DEF_ROW_TYPE> = {
  row: TableRow<T>
}

export type ShowDetailEvent<T = DEF_ROW_TYPE> = DetailEvent<T>
export type HideDetailEvent<T = DEF_ROW_TYPE> = DetailEvent<T>
export type ButtonEvent<T = DEF_ROW_TYPE> = {
  label: string
  row: TableRow<T>
}
export type ToggleEvent<T = DEF_ROW_TYPE> = ButtonEvent<T> & {
  selected: boolean
}

export type PagingEvent = {
  offset: number
  recordsShowing: number
  cursor: string | number // cursor to "page" to display next
  thisCursor: string | number // cursor of current page
}

export type TableEvents<T = DEF_ROW_TYPE> = {
  onRowClicked: RowClickedEvent<T>
  onRowSelected: RowsSelectedEvent<T>
  onAllRowsSelected: AllRowsSelectedEvent<T>
  onColumnSort: ColSortEvent
  onShowDetail: ShowDetailEvent<T>
  onHideDetail: HideDetailEvent<T>
  onButtonClicked: ButtonEvent<T>
  onCheckboxClicked: ToggleEvent<T>

  onNewPage: PagingEvent
}
