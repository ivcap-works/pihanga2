import { ColorT, DecoratorT, SizeT, VariantT } from "./common"
import {
  createCardDeclaration,
  createOnAction,
  registerActions,
} from "@pihanga2/core"

export const CHIP_CARD = "chip"
export const Chip = createCardDeclaration<ChipProps>(CHIP_CARD)

export const CHIP_ACTION = registerActions(CHIP_CARD, ["select", "delete"])

export const onChipSelect = createOnAction<ChipSelectEvent>(CHIP_ACTION.SELECT)
export const onChipDelete = createOnAction<ChipDeleteEvent>(CHIP_ACTION.DELETE)

export type ChipProps<S = any> = {
  label: string
  variant?: VariantT
  color?: ColorT
  size?: SizeT
  disabled?: boolean
  startDecorator?: DecoratorT
  endDecorator?: DecoratorT

  style?: S
  className?: string
}

export type ChipSelectEvent = {}
export type ChipDeleteEvent = {}

export type ChipEvents = {
  onSelect: ChipSelectEvent
  onDelete: ChipDeleteEvent
}
