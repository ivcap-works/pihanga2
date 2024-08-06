import * as React from "react"
import Box from "@mui/joy/Box"

import { Card, PiCardProps } from "@pihanga2/core"
import { BoxProps } from "@pihanga2/cards"

export const BoxComponent = (props: PiCardProps<BoxProps>): React.ReactNode => {
  const { component, content, className, style, cardName } = props

  const p = {
    height: props.height,
    width: props.width,

    marginTop: props.marginTop,
    marginBottom: props.marginBottom,
    marginLeft: props.marginLeft,
    marginRight: props.marginRight,

    paddingTop: props.paddingTop,
    paddingBottom: props.paddingBottom,
    paddingLeft: props.paddingLeft,
    paddingRight: props.paddingRight,

    alignItems: props.alignItems,
    gap: props.gap,
    padding: props.padding,
  }

  const sx = {
    ...style?.joy,
    display: props.display,
  }

  function renderContent() {
    if (!content) return null
    return content.map((cn, i) => (
      <Card cardName={cn} parentCard={cardName} key={i} />
    ))
  }

  return (
    <Box
      component={component}
      {...p}
      className={className}
      sx={sx}
      data-pihanga={cardName}
    >
      {renderContent()}
      {props.children}
    </Box>
  )
}
