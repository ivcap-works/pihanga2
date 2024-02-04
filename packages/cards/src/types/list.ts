//import { SxProps } from "@mui/material"
import {
  ReduxAction,
  createCardDeclaration,
  createOnAction,
  registerActions,
} from "@pihanga/core"
import { DecoratorT, TypographyLevelT } from "./common"

export const CARD_TYPE = "list"
export const List = createCardDeclaration<ListProps, ComponentEvents>(CARD_TYPE)

export const ACTION_TYPES = registerActions(CARD_TYPE, ["item_clicked"])

export const onItemClicked = createOnAction<ItemClickedEvent>(
  ACTION_TYPES.ITEM_CLICKED,
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

export type ComponentEvents = {
  onItemClicked: ItemClickedEvent
}
