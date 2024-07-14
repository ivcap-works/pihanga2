import {
  PiCardRef,
  createCardDeclaration,
  createOnAction,
  registerActions,
} from "@pihanga2/core"
import { TypographyBase } from "./typography"

export const LINK_CARD = "link"
export const Link = createCardDeclaration<LinkProps, LinkEvents>(LINK_CARD)

export const LINK_ACTIONS = registerActions(LINK_CARD, ["clicked"])

export const onClicked = createOnAction<LinkClickedEvent>(LINK_ACTIONS.CLICKED)

export type LinkProps = {
  text?: string
  href?: string
  childCard?: PiCardRef
  overlay?: boolean // make an entire component clickable as a link
  underline?: Underline
  tooltip?: string
  isDisabled?: boolean
} & TypographyBase

export type Underline = "always" | "hover" | "none"

export type LinkClickedEvent = {
  href?: string
}

export type LinkEvents = {
  onClicked: LinkClickedEvent
}
