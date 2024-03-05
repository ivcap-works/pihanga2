import {
  ReduxAction,
  createCardDeclaration,
  createOnAction,
  registerActions,
} from "@pihanga2/core"
import { ColorT, DecoratorT, SizeT, VariantT } from "./common"

export const CARD_TYPE = "button"
export const Button = createCardDeclaration<ButtonProps, ComponentEvents>(
  CARD_TYPE,
)

export const ACTION_TYPES = registerActions(CARD_TYPE, ["clicked"])

export const onClicked = createOnAction<ClickedEvent>(ACTION_TYPES.CLICKED)

export type ButtonProps = {
  label: string
  tooltip?: string
  isDisabled?: boolean
  isLoading?: boolean
  loadingPosition?: "center" | "start" | "end"
  size?: SizeT
  color?: ColorT
  variant?: VariantT
  startDecorator?: DecoratorT
  endDecorator?: DecoratorT
}

export type ClickedEvent = {}

export type ComponentEvents = {
  onClicked: ClickedEvent
}
