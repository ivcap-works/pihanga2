import * as React from "react"
import { CssVarsProvider } from "@mui/joy/styles"
import CssBaseline from "@mui/joy/CssBaseline"


import { Card, PiCardProps, WindowProps } from "@pihanga2/core"

export const Component = (props: PiCardProps<WindowProps>): React.ReactNode => {
  const { page, theme, cardName } = props

  return (
    <CssVarsProvider
      disableTransitionOnChange
      theme={theme}
      data-pihanga={cardName}
    >
      <CssBaseline />
      <Card cardName={page} parentCard={cardName} />
    </CssVarsProvider>
  )
}
