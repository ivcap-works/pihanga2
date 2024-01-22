import * as React from "react"
import Box from "@mui/joy/Box"

import { Card, PiCardProps } from "@pihanga/core"
import { ComponentProps } from "./box.types"

export const Component = (
  props: PiCardProps<ComponentProps>,
): React.ReactNode => {
  const { content: contentCard, component, className, joy, cardName } = props
  return (
    <Box
      component={component}
      className={className}
      sx={joy?.sx?.root}
      data-pihanga={cardName}
    >
      <Card cardName={contentCard} parentCard={cardName} />
    </Box>
  )
}
