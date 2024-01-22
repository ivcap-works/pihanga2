import React from "react"
import { Card, PiCardProps, PiCardRef, isCardRef } from "@pihanga/core"
import {
  ComponentEvents,
  AccordionProps,
  Item,
} from "@pihanga/cards/dist/types/accordion"
import {
  Accordion,
  AccordionDetails,
  AccordionGroup,
  AccordionSummary,
  Typography,
} from "@mui/joy"
import { SxProps } from "@mui/material"

export type ComponentProps = AccordionProps & {
  sx?: {
    root?: SxProps
    items?: {
      [id: string]: {
        title?: SxProps
        content?: SxProps
      }
    }
  }
}

export const DEF_ITEM = "_default"

export const DEF_SX = {
  root: {},
  items: {
    DEF_ITEM: {
      title: {},
      content: {},
    },
  },
}

export const AccoridonComponent = (
  props: PiCardProps<ComponentProps, ComponentEvents>,
): React.ReactNode => {
  const {
    items,
    size,
    disableDivider,
    variant,
    onChanged,
    sx,
    cardName,
    _cls,
  } = props

  function renderItem(item: Item, idx: number): React.ReactNode {
    const p: any = { variant: item.variant, color: item.color }
    if (item.expanded !== undefined) {
      p.expanded = item.expanded
    }
    if (item.disabled !== undefined) {
      p.disableDivider = item.disabled
    }
    if (item.defaultExpanded !== undefined) {
      p.defaultExpanded = item.defaultExpanded
    }
    const isx = sx?.items || {}
    return (
      <Accordion
        {...p}
        onChange={(_, expanded) => onChanged({ itemID: item.id, expanded })}
        className={_cls(["item", `item-${item.id || idx}`])}
        key={item.id || idx}
      >
        <AccordionSummary sx={isx[item.id]?.title || isx[DEF_ITEM]?.title}>
          {renderContent(item.title)}
        </AccordionSummary>
        <AccordionDetails sx={isx[item.id]?.content || isx[DEF_ITEM]?.content}>
          {renderContent(item.content)}
        </AccordionDetails>
      </Accordion>
    )
  }

  function renderContent(
    el: string | PiCardRef | PiCardRef[],
  ): React.ReactNode {
    if (typeof el === "string") {
      return el
    } else if (Array.isArray(el)) {
      return <>{el.map(renderContent)}</>
    } else if (typeof el === "object") {
      if (isCardRef(el)) {
        return <Card cardName={el} parentCard={cardName} />
      }
    } else {
      return (
        <Typography color="danger">
          {`Unknown accordion content '${el}'`}
        </Typography>
      )
    }
  }

  return (
    <AccordionGroup
      size={size}
      disableDivider={disableDivider}
      variant={variant}
      sx={sx?.root || DEF_SX.root}
      data-pihanga={cardName}
    >
      {items.map(renderItem)}
    </AccordionGroup>
  )
}
