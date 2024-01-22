import { SxProps } from "@mui/material"
import { PiCardRef, createCardDeclaration, createOnAction, registerActions } from "@pihanga/core"
import { ColorT, DecoratorT, SizeT, VariantT } from "@pihanga/cards/dist/types"
import { IconId } from "@pihanga/cards/dist/icons"

export const CARD_TYPE = "icon_button"
export const IconButton = createCardDeclaration<IconButtonProps, ComponentEvents>(CARD_TYPE)

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
