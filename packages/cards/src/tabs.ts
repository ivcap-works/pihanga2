import {
  PiCardDef,
  PiCardRef,
  createCardDeclaration,
  createOnAction,
  registerActions,
} from "@pihanga2/core"
import { ColorT, SizeT, VariantT } from "./common"

export const TABS_CARD = "tabs"
export const Tabs = createCardDeclaration<TabsProps, TabsEvents>(TABS_CARD)

export const TABS_ACTION = registerActions(TABS_CARD, ["change"])

export const onTabsChange = createOnAction<TabsChangeEvent>(TABS_ACTION.CHANGE)

export type TabsProps<S = any> = {
  tabs: TabT[]
  value?: string // 'id' of TabT
  defaultValue?: string // 'id' of TabT

  color?: ColorT
  disabled?: boolean
  selectionFollowsFocus?: boolean // If true the selected tab changes on focus. Otherwise it only changes on activation.

  orientation?: "horizontal" | "vertical"
  variant?: VariantT
  ariaLabel?: string

  // TAB LIST

  tabFlex?: string
  disableUnderline?: boolean // If true, the TabList's underline will disappear.
  size?: SizeT
  sticky?: "bottom" | "top" // If provided, the TabList will have postion sticky.
  underlinePlacement?: "bottom" | "left" | "right" | "top"

  className?: string
  style?: S
}

export type TabT = {
  id: string
  title: string | PiCardDef
  content: PiCardRef
  size?: SizeT
  disabled?: boolean
  variant?: VariantT
  color?: ColorT
  className?: string

  indicatorPlacement?: "bottom" | "left" | "right" | "top"
  disableIndicator?: boolean
  indicatorInset?: boolean
}

export type TabsChangeEvent = {
  tabID: string
}

export type TabsEvents = {
  onChange: TabsChangeEvent
}
