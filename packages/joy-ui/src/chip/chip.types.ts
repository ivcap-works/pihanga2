import { SxProps } from "@mui/material"
import { } from "@mui/material/styles/createTypography"
import { PiCardRef } from "@pihanga/core"
import { ColorT, DecoratorT, SizeT, VariantT } from "@pihanga/cards/dist/types"

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
