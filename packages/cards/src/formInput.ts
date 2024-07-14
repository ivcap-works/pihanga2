import {
  PiCardDef,
  createCardDeclaration,
  createOnAction,
  registerActions,
} from "@pihanga2/core"
import { ColorT, DecoratorT, SizeT, VariantT } from "./common"

export const FORM_INPUT_CARD = "formInput"
export const FormInput = createCardDeclaration<FormInputProps, FormInputEvents>(
  FORM_INPUT_CARD,
)

export const FORM_INPUT_ACTION = registerActions(FORM_INPUT_CARD, ["change"])

export const onFormInputChange = createOnAction<FormInputChangeEvent>(
  FORM_INPUT_ACTION.CHANGE,
)

export const DEF_THROTTLE_WAIT = 200 // throttle wait in msec

export type FormInputProps<S = any> = {
  name: string
  label?: string
  value?: string // when
  defaultValue?: string
  reportChange?: boolean // if true issue a changeEvent whenever value changes
  throttleWait?: number // set to msec if changeEvents should be throttled, [200msec]
  required?: boolean
  helperText?: string | PiCardDef // optional Typography card
  isDisabled?: boolean
  placeholder?: string
  inError?: boolean // if true input is styled to reflect error
  color?: ColorT
  size?: SizeT
  fullWidth?: boolean // If true, the input will take up the full width of its container.
  variant?: VariantT
  startDecorator?: DecoratorT
  endDecorator?: DecoratorT

  tooltip?: string

  style?: S
  className?: string
}

export type FormInputChangeEvent = {
  value: string
}

export type FormInputEvents = {
  onChange: FormInputChangeEvent
}
