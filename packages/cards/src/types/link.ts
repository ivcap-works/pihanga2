import {
  PiCardRef,
  ReduxAction,
  createCardDeclaration,
  createOnAction,
  registerActions,
} from "@pihanga/core"
import { ColorT, DecoratorT, SizeT, TypographyLevelT, VariantT } from "."

export const LINK_TYPE = "link"
export const Link = createCardDeclaration<LinkProps, ComponentEvents>(LINK_TYPE)

export const ACTION_TYPES = registerActions(LINK_TYPE, ["clicked"])

export const onClicked = createOnAction<ClickedEvent>(ACTION_TYPES.CLICKED)

export type LinkProps = {
  text?: string
  href?: string
  childCard?: PiCardRef
  level?: TypographyLevelT
  underline?: Underline
  tooltip?: string
  isDisabled?: boolean
  size?: SizeT
  color?: ColorT
  variant?: VariantT
  startDecorator?: DecoratorT
  endDecorator?: DecoratorT
  actionMapper?: <A extends ReduxAction>(el: LinkProps) => A
}

export type Underline = "always" | "hover" | "none"

export type ClickedEvent = {
  href?: string
}

export type ComponentEvents = {
  onClicked: ClickedEvent
}
