import {
  createCardDeclaration,
  createOnAction,
  registerActions,
} from "@pihanga2/core"
import { SizeT, ColorT, VariantT, DecoratorT } from "./common"

export const BUTTON_CARD = "button"
export const Button = createCardDeclaration<ButtonProps, ComponentEvents>(
  BUTTON_CARD,
)

export const BUTTON_ACTION = registerActions(BUTTON_CARD, ["clicked"])

export const onButtonClicked = createOnAction<ButtonClickedEvent>(
  BUTTON_ACTION.CLICKED,
)

export type ButtonProps<S = any> = {
  label: string
  tooltip?: string
  isDisabled?: boolean
  isLoading?: boolean
  loadingPosition?: "center" | "start" | "end"
  size?: SizeT
  fullWidth?: true // If true, the button will take up the full width of its container.
  color?: ColorT
  variant?: VariantT
  isSubmit?: boolean
  isLink?: boolean //  true if it triggers action to navigate to a new page
  startDecorator?: DecoratorT
  endDecorator?: DecoratorT
  style?: S
  className?: string
}

export type ButtonClickedEvent = {}

export type ComponentEvents = {
  onClicked: ButtonClickedEvent
}
