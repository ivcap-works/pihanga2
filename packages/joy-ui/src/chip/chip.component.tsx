import React from "react"
import { PiCardProps } from "@pihanga2/core"
import { ChipEvents, ChipProps } from "@pihanga2/cards"
import { Chip } from "@mui/joy"
import { renderDecorator } from "../utils"

export const Component = (
  props: PiCardProps<ChipProps, ChipEvents>,
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
    style,
    cardName,
  } = props

  let sx = style?.joy || {}

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
      startDecorator={renderDecorator(startDecorator, cardName)}
      endDecorator={renderDecorator(endDecorator, cardName)}
      onClick={() => onSelect({})}
      data-pihanga={cardName}
    >
      {label}
    </Chip>
  )
}
