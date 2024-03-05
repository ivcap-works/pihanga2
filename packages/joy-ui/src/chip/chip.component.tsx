import React from "react"
import { PiCardProps } from "@pihanga2/core"
import { ComponentEvents, ComponentProps } from "./chip.types"
import { Chip } from "@mui/joy"
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
