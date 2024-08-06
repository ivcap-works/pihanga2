import {
  PiCardDef,
  PiCardRef,
  PiMapProps,
  ReduxAction,
  ReduxState,
  createOnAction,
  registerActions,
} from "@pihanga2/core"
import { ColorT } from "./common"
import { ButtonProps } from "./button"
import { LinkProps } from "./link"
import { TypographyProps } from "./typography"

const DATA_GRID_CARD = "dataGrid"

export function DataGrid<T extends { [k: string]: any }>(): <
  S extends ReduxState,
>(
  p: PiMapProps<DataGridProps<T>, S, DataGridEvents>,
) => PiCardDef {
  return (p) => ({
    ...p,
    cardType: DATA_GRID_CARD,
  })
}

export const DATA_GRID_ACTION = registerActions(DATA_GRID_CARD, [
  "button_clicked",
  "link_clicked",
])

export const onDataGridButtonClicked = createOnAction<DataGridButtonClickedEvent>(
  DATA_GRID_ACTION.BUTTON_CLICKED,
)
export const onDataGridLinkClicked = createOnAction<DataGridLinkClickedEvent>(
  DATA_GRID_ACTION.LINK_CLICKED,
)

type DEF_DG_TYPE = { [k: string]: any }

export type DataGridProps<T extends { [k: string]: any } = DEF_DG_TYPE> = {
  items: DataGridEl[]
  data: T
  cardOnEmpty?: PiCardRef // card to display when no items are available
  dateFormatter?: (d: Date) => string
}

export const DEF_DATE_FORMATTER = new Intl.DateTimeFormat([], {
  dateStyle: "short",
  timeStyle: "short",
})

export type TitledDataGridEl =
  | TextEl
  | LinkEl
  | StatusEl
  | CheckboxEl
  | InputEl
  | DateEl
  | ButtonEl
  | CardEl

export type DataGridEl = TitledDataGridEl | SeparatorEl
// | TiteledEl // to keep type checker happy

export type Element = {
  type: DataGridElTypeE
  style?: {
    root?: React.CSSProperties
    title?: React.CSSProperties
    value?: React.CSSProperties
  }
}

export type TiteledEl = Element & {
  id: string
  title?: string
  hideTitle?: boolean
  // joy?: {
  //   sx?: {
  //     root: SxProps
  //     title: SxProps
  //   }
  // }
}

export type TextEl = TiteledEl &
  TypographyProps & {
    type: DataGridElTypeE.Text
  }
export type LinkEl = TiteledEl &
  LinkProps & {
    type: DataGridElTypeE.Link
  }
export type StatusEl = TiteledEl & {
  type: DataGridElTypeE.Status
  statusColor?: ColorT
}
export type CheckboxEl = TiteledEl & {
  type: DataGridElTypeE.Checkbox
  checked?: boolean
}
export type InputEl = TiteledEl & {
  type: DataGridElTypeE.Input
  placeHolder?: string
}
export type DateEl = TiteledEl & {
  type: DataGridElTypeE.Date
}
export type ButtonEl = TiteledEl &
  ButtonProps & {
    type: DataGridElTypeE.Button
    actionMapper?: <A extends ReduxAction>(el: ButtonEl) => A
  }
export type CardEl = TiteledEl & {
  type: DataGridElTypeE.Card
  cardName: PiCardRef
  context?: { [k: string]: string }
}
export type SeparatorEl = Element & {
  type: DataGridElTypeE.Separator
}

export enum DataGridElTypeE {
  Group = "group",
  Text = "text",
  Link = "link",
  Status = "status",
  Checkbox = "checkbox",
  Input = "input",
  Date = "date",
  Button = "button",
  Card = "card",
  Separator = "separator",
}

export type DataGridButtonClickedEvent = {
  buttonID: string
}

export type DataGridLinkClickedEvent = {
  linkID: string
}

export type DataGridEvents = {
  onButtonClicked: DataGridButtonClickedEvent
  onLinkClicked: DataGridLinkClickedEvent
}
