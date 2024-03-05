import { SxProps } from "@mui/material"
import { ColorT, DecoratorT, SizeT, VariantT } from "@pihanga2/cards/src/common"

export type ChipProps = {
  label: string
  variant?: VariantT
  color?: ColorT
  size?: SizeT
  disabled?: boolean
  startDecorator?: DecoratorT
  endDecorator?: DecoratorT
}

export type ComponentProps = ChipProps & {
  joy?: {
    sx?: {
      root?: SxProps
    }
  }
}

export const DEF_ROOT_SX: SxProps = {}

export type SelectEvent = {}
export type DeleteEvent = {}

export type ComponentEvents = {
  onSelect: SelectEvent
  onDelete: DeleteEvent
}
