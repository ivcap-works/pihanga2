import {
  createCardDeclaration,
  createOnAction,
  registerActions,
} from "@pihanga2/core"
import { ColorT, SizeT, VariantT } from "@pihanga2/cards"
import { IconId } from "@pihanga2/cards"

export const CARD_TYPE = "icon_button"
export const IconButton = createCardDeclaration<
  IconButtonProps,
  ComponentEvents
>(CARD_TYPE)

export const ACTION_TYPES = registerActions(CARD_TYPE, ["clicked"])

export const onClicked = createOnAction<ClickedEvent>(ACTION_TYPES.CLICKED)

export type IconButtonProps = {
  iconID?: IconId
  ariaLabel: string
  tooltip?: boolean
  isDisabled?: boolean
  size?: SizeT
  color?: ColorT
  variant?: VariantT
}

export type ClickedEvent = {}

export type ComponentEvents = {
  onClicked: ClickedEvent
}
