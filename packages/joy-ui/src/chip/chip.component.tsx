import React from "react"
import { Card, PiCardProps } from "@pihanga/core"
import { ComponentEvents, ComponentProps, DEF_ROOT_SX } from "./chip.types"
import { Avatar, Chip, ChipDelete } from "@mui/joy"
import { DeleteForever } from "@mui/icons-material"
import { DecoratorT, DecoratorE } from "@pihanga/cards/dist/types"
import { getIcon } from "@pihanga/cards/dist/icons"
import { renderDecorator } from "../utils"

export const Component = (
  props: PiCardProps<ComponentProps, ComponentEvents>,
): React.ReactNode => {
  const {
    label,
    variant,
    color,
    size,
    startDecorator,
    endDecorator,
    onSelect,
    onDelete,
    joy,
    cardName,
  } = props

  // function renderDelete() {
  //   return (
  //     <ChipDelete color="danger" variant="plain" onClick={() => onDelete({})}>
  //       <DeleteForever />
  //     </ChipDelete>
  //   )
  // }


  return (
    <Chip
      variant={variant}
      color={color}
      size={size}
      startDecorator={renderDecorator(startDecorator)}
      endDecorator={renderDecorator(endDecorator)}
      onClick={() => onSelect({})}
      data-pihanga={cardName}
    >
      {label}
    </Chip>
  )
}
