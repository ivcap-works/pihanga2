import React from "react"
import { Card, PiCardProps } from "@pihanga2/core"
import { ComponentEvents, FooProps } from "./foo.types"
import { Box } from "@mui/joy"
import { DEF_SX, FooSX } from "./foo.sx"

export type JyFooProps = FooProps<{ joy: FooSX }>

export const FooComponent = (
  props: PiCardProps<JyFooProps, ComponentEvents>,
): React.ReactNode => {
  const { contentCard, style, cardName } = props

  const sx = { ...DEF_SX, ...style?.joy }
  return (
    <Box sx={sx.root} data-pihanga={cardName}>
      <Card cardName={contentCard} parentCard={cardName} />
    </Box>
  )
}
