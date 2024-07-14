import React from "react"
import { SxProps } from "@mui/material"
import { Card, PiCardProps } from "@pihanga2/core"
import { TypographyProps } from "@pihanga2/cards/src/typography"
import { Typography } from "@mui/joy"
import { renderDecorator } from "../utils"

export type ComponentProps = TypographyProps & {
  joy?: {
    sx?: {
      root?: SxProps
    }
  }
}

export const DEF_SX: { [k: string]: SxProps } = {
  root: {},
}

export const TypographyComponent = (
  props: PiCardProps<ComponentProps>,
): React.ReactNode => {
  const {
    text,
    childCard,
    paragraph,

    noWrap,
    level,
    color,
    gutterBottom,
    variant,
    startDecorator,
    endDecorator,
    textColor,
    textAlign,
    fontSize,
    fontWeight,
    joy,
    cardName,
    _dispatch,
    _cls,
  } = props

  const p = {
    noWrap,
    level,
    color,
    gutterBottom,
    variant,
    startDecorator: renderDecorator(startDecorator, cardName),
    endDecorator: renderDecorator(endDecorator, cardName),
    textColor,
    textAlign,
    fontSize,
    fontWeight,
  }

  function renderChildren() {
    if (childCard) {
      return <Card cardName={childCard} parentCard={cardName} />
    } else if (paragraph) {
      return <>{paragraph.map(renderParaItem)}</>
    } else {
      return text
    }
  }

  function renderParaItem(el: string | TypographyProps, idx: number) {
    if (typeof el === "string") {
      return el as string
    } else if (typeof el === "string") {
      // should be TypographyProps
      const p = {
        ...(el as any),
        _dispatch,
        _cls,
      }
      return TypographyComponent(p)
    } else {
      return `... undefined paragraph item '${el}' ...`
    }
  }

  return (
    <Typography
      {...p}
      sx={joy?.sx?.root || DEF_SX.root}
      data-pihanga={cardName}
    >
      {renderChildren()}
    </Typography>
  )
}
