import * as React from "react"
import { CssVarsProvider } from "@mui/joy/styles"
import CssBaseline from "@mui/joy/CssBaseline"


import { Card, PiCardProps } from "@pihanga2/core"
import { ComponentProps } from "./framework.types"

export const Component = (
  props: PiCardProps<ComponentProps>,
): React.ReactNode => {
  const { contentCard, cardName } = props
  return (
    <CssVarsProvider disableTransitionOnChange data-pihanga={cardName}>
      <CssBaseline />
      <Card cardName={contentCard} parentCard={cardName} />
    </CssVarsProvider>
  )
}
