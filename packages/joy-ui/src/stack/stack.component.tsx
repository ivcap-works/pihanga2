import * as React from "react"
import Stack from "@mui/joy/Stack"
import { StackProps } from "@pihanga2/cards"

import { Card, PiCardProps } from "@pihanga2/core"

export const Component = (props: PiCardProps<StackProps>): React.ReactNode => {
  const {
    content,
    direction,
    divider,
    spacing,
    justifyContent,
    alignItems,
    className,
    style,
    cardName,
  } = props
  const sx = style?.joy
  const p = {
    direction,
    spacing,
    justifyContent,
    alignItems,
    divider: divider ? <Card cardName={divider} parentCard={cardName} /> : null,
    sx,
    className,
  }

  function renderContent() {
    if (!content) return null
    return content.map((cn, i) => (
      <Card cardName={cn} parentCard={cardName} key={i} />
    ))
  }

  return (
    <Stack {...p} data-pihanga={cardName}>
      {renderContent()}
      {props.children}
    </Stack>
  )
}
