//import { SxProps } from "@mui/material"
import {
  ReduxAction,
  createCardDeclaration,
  createOnAction,
  registerActions,
} from "@pihanga2/core"
import { DecoratorT, TypographyLevelT } from "./common"

export const LIST_CARD = "list"
export const List = createCardDeclaration<ListProps, ListEvents>(LIST_CARD)

export const LIST_ACTION = registerActions(LIST_CARD, ["item_clicked"])

export const onItemClicked = createOnAction<ItemClickedEvent>(
  LIST_ACTION.ITEM_CLICKED,
)

export type ListProps = {
  items: Item[]
  size?: "sm" | "md" | "lg"
  component?: string // control which HTML tag is rendered
  // role="menubar" orientation="horizontal"
  marker?: MarkerT
}

export type MarkerT =
  | "disc"
  | "circle"
  | "square"
  | "decimal"
  | "georgian"
  | "trad-chinese-informal"
  | "kannada"
  | "none"
  | string

export type Item = {
  id: any // used as key
  isSelected?: boolean
  title: string
  subTitle?: string // level="body-sm" noWrap
  nested?: Item[]
  startDecorator?: DecoratorT
  endDecorator?: DecoratorT
  titleLevel?: TypographyLevelT // "title-sm"
  subTitleLevel?: TypographyLevelT // "body-sm"
  onItemClickedMapper?: (ev: ItemClickedEvent) => ReduxAction
}

export type ItemClickedEvent = {
  itemID: string
}

export type ListEvents = {
  onItemClicked: ItemClickedEvent
}
