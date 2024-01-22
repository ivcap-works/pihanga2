import React from "react"
import { Card, PiCardProps } from "@pihanga/core"
import { ComponentEvents, FooProps, DEF_SX } from "./foo.types"
import { Box } from "@mui/joy"


export const FooComponent = (
  props: PiCardProps<FooProps, ComponentEvents>,
): React.ReactNode => {
  const { contentCard, joy, cardName } = props

  return (
    <Box sx={joy?.sx?.root || DEF_SX.root} data-pihanga={cardName}>
      <Card cardName={contentCard} parentCard={cardName} />
    </Box>
  )
}
