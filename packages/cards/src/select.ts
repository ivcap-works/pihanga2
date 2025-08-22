import {
  PiCardDef,
  createCardDeclaration,
  createOnAction,
  registerActions,
} from "@pihanga2/core"
import { ColorT, DecoratorT, SizeT, VariantT } from "./common"

export const SELECT_CARD = "select"
export const Select = createCardDeclaration<SelectProps, SelectEvents>(
  SELECT_CARD,
)

export const SELECT_ACTION = registerActions(SELECT_CARD, [
  "change",
  "open",
  "close",
])

export const onSelectChange = createOnAction<SelectChangeEvent>(
  SELECT_ACTION.CHANGE,
)
export const onSelectOpen = createOnAction<SelectOpenCloseEvent>(
  SELECT_ACTION.OPEN,
)
export const onSelectClose = createOnAction<SelectOpenCloseEvent>(
  SELECT_ACTION.CLOSE,
)

export type SelectProps<S = any> = {
  name: string
  options: SelectOptionT[]
  value?: string
  defaultValue?: string // The default selected value. Use when the component is not controlled.
  ariaLabel?: string
  disabled?: boolean
  multiple?: boolean
  placeholder?: string
  required?: boolean
  defaultListboxOpen?: boolean // If true, the select will be initially open.

  variant?: VariantT
  color?: ColorT
  size?: SizeT
  startDecorator?: DecoratorT
  endDecorator?: DecoratorT

  className?: string
  style?: S
}

export type SelectOptionT = {
  id: string
  label: string | PiCardDef
  color?: ColorT
  disabled?: boolean
  variant?: VariantT
}

export type SelectChangeEvent = {
  optionID: string | string[] | null
}

export type SelectOpenCloseEvent = {}

export type SelectEvents = {
  onChange: SelectChangeEvent
  onOpen: SelectOpenCloseEvent
  onClose: SelectOpenCloseEvent
}
