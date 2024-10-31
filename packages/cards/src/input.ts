import {
  createCardDeclaration,
  createOnAction,
  registerActions,
} from "@pihanga2/core"
import { ColorT, DecoratorT, SizeT, VariantT } from "./common"

export const INPUT_CARD = "input"
export const Input = createCardDeclaration<InputProps, InputEvents>(INPUT_CARD)

export const INPUT_ACTION = registerActions(INPUT_CARD, ["change"])

export const onInputChange = createOnAction<InputChangeEvent>(
  INPUT_ACTION.CHANGE,
)

export type InputProps<S = any> = {
  name: string
  required?: boolean
  placeholder?: string
  fullWidth?: boolean

  error?: boolean // If true, the input will indicate an error. [false]
  debounceTimeout?: number // report 'onChange' debounced '0' - no debouncing [msec]
  color?: ColorT
  size?: SizeT
  variant?: VariantT
  startDecorator?: DecoratorT
  endDecorator?: DecoratorT
  style?: S
  className?: string
}

export type InputChangeEvent = {
  value: string
}

export type InputEvents = {
  onChange: InputChangeEvent
}
