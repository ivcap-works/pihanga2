import React from "react"
import { Card, PiCardProps, PiCardRef, isCardRef } from "@pihanga2/core"
import {
  AccordionEvents,
  AccordionProps,
  AccordionItem,
} from "@pihanga2/cards/src"
import {
  Accordion,
  AccordionDetails,
  AccordionGroup,
  AccordionSummary,
  Typography,
} from "@mui/joy"
import { SxProps } from "@mui/material"

export type ComponentProps = AccordionProps & {
  sx?: AccordionSX
}

export type AccordionSX = {
  root?: SxProps
  items?: {
    [id: string]: {
      title?: SxProps
      content?: SxProps
    }
  }
}

export const DEF_ACCORDION_ITEM = "_default"

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
  props: PiCardProps<ComponentProps, AccordionEvents>,
): React.ReactNode => {
  const {
    items,
    size,
    disableDivider,
    variant,
    className,
    style,
    onChanged,
    cardName,
    _cls,
  } = props
  const sx = {
    ...DEF_SX,
    ...style?.joy,
  }

  function renderItem(item: AccordionItem, idx: number): React.ReactNode {
    const p: any = { variant: item.variant, color: item.color, sx: sx.root }
    if (item.expanded !== undefined) {
      p.expanded = item.expanded
    }
    if (item.disabled !== undefined) {
      p.disableDivider = item.disabled
    }
    if (item.defaultExpanded !== undefined) {
      p.defaultExpanded = item.defaultExpanded
    }
    const isx = sx.items
    const titleSX = isx[item.id]?.title || isx[DEF_ACCORDION_ITEM]?.title
    return (
      <Accordion
        {...p}
        onChange={(_, expanded) =>
          onChanged({ itemID: item.id, expanded, context: item.context })
        }
        className={_cls(["item", `item-${item.id || idx}`])}
        key={item.id || idx}
      >
        <AccordionSummary
          sx={titleSX}
          className={_cls(["item-title", `item-title-${item.id || idx}`])}
        >
          {renderContent(item.title)}
        </AccordionSummary>
        <AccordionDetails
          sx={isx[item.id]?.content || isx[DEF_ACCORDION_ITEM]?.content}
          className={_cls(["item-content", `item-content-${item.id || idx}`])}
        >
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
      className={_cls("root")}
      data-pihanga={cardName}
    >
      {items.map(renderItem)}
    </AccordionGroup>
  )
}
