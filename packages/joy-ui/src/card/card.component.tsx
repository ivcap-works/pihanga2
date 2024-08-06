import * as React from "react"
import JoyCard from "@mui/joy/Card"
import CardContent from "@mui/joy/CardContent"
import { CardContentT, CardProps } from "@pihanga2/cards"

import { Card, PiCardProps, PiCardRef } from "@pihanga2/core"
import { SxProps } from "@mui/material"
import { CardActions, CardOverflow } from "@mui/joy"

export type ComponentProps = CardProps & {
  joy?: {
    sx?: SxProps
  }
}

export const Component = (
  props: PiCardProps<ComponentProps>,
): React.ReactNode => {
  const {
    content,
    actions,
    color,
    invertedColors,
    orientation,
    size,
    variant,
    shadowSize,
    flexDirection,

    component,
    className,
    style,
    cardName,
  } = props
  const sx = style?.sx || {}

  function renderContent(c: CardContentT, idx: number) {
    const p: any = {
      component: c.component,
    }
    if (p.alignItems) p.alignItems = c.alignItems
    if (p.textAlign) p.textAlign = c.textAlign
    if (p.orientation) p.orientation = c.orientation
    const C = c.hidePadding ? CardOverflow : CardContent
    if (c.hidePadding) {
      return (
        <CardOverflow {...p} key={idx}>
          <Card cardName={c.content} parentCard={cardName} />
        </CardOverflow>
      )
    } else {
      return <Card cardName={c.content} parentCard={cardName} key={idx} />
    }
  }

  function renderActions() {
    if (!actions) return null

    const { content, orientation, buttonFlex, component } = actions
    const p: any = {
      component,
    }
    if (p.buttonFlex) p.buttonFlex = buttonFlex
    if (p.orientation) p.orientation = orientation

    function renderCard(cn: PiCardRef, idx: number) {
      return <Card cardName={cn} parentCard={cardName} key={idx} />
    }
    return <CardActions {...p}>{content.map(renderCard)}</CardActions>
  }

  const cp: any = {
    color,
    invertedColors,
    orientation,
    size,
    variant,

    component,
    className,
  }
  if (shadowSize) {
    sx["&:hover"] = {
      boxShadow: shadowSize,
      borderColor: "var(--joy-palette-neutral-outlinedDisabledBorder)",
    }
  }
  if (flexDirection) {
    sx.display = "flex"
    sx.flexDirection = flexDirection
  }

  return (
    <JoyCard {...cp} sx={sx} data-pihanga={cardName}>
      <CardContent>{content.map(renderContent)}</CardContent>
      {renderActions()}
      {props.children}
    </JoyCard>
  )
}
