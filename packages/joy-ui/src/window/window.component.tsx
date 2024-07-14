import * as React from "react"

import { Card, PiCardProps } from "@pihanga2/core"
import { CssBaseline, CssVarsProvider } from "@mui/joy"

import { WindowProps } from "./window.type"

export const Component = (props: PiCardProps<WindowProps>): React.ReactNode => {
  const { content, defaultMode, disableTransitionOnChange, theme, cardName } =
    props

  const p = { defaultMode, disableTransitionOnChange, theme }

  function renderContent() {
    if (!content) return null
    return content.map((cn, i) => (
      <Card cardName={cn} parentCard={cardName} key={i} />
    ))
  }

  return (
    <CssVarsProvider {...p} data-pihanga={cardName}>
      <CssBaseline />
      <>{renderContent()}</>
      {props.children}
    </CssVarsProvider>
  )
}
