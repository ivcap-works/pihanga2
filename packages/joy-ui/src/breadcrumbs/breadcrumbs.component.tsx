import React from "react"
import { PiCardProps } from "@pihanga2/core"
import { Box, Breadcrumbs, Link, Typography } from "@mui/joy"
import { renderDecorator } from "../utils"

import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded"

import { BreadCrumb, BreadcrumbEvents, BreadcrumbsProps } from "@pihanga2/cards"
import { SxProps } from "@mui/joy/styles/types"

export type ComponentProps = BreadcrumbsProps & {
  joy?: {
    sx?: {
      root?: SxProps
    }
  }
}

export const DEF_ROOT_SX: SxProps = {
  display: "flex",
  alignItems: "center",
}

export const Component = (
  props: PiCardProps<ComponentProps, BreadcrumbEvents>,
): React.ReactNode => {
  const { breadcrumbs, onSelect, joy, cardName } = props
  const l = breadcrumbs.length
  if (l === 0) return null
  const links = breadcrumbs.slice(0, -1)
  const last = breadcrumbs[l - 1]

  function renderLink(l: BreadCrumb) {
    const sx = (l as any).joy?.sx as SxProps
    return (
      <Link
        component="button"
        onClick={() => onSelect({ id: l.id })}
        // href="#some-link"
        color={l.color || "primary"}
        fontSize={l.fontSize || 12}
        fontWeight={l.fontWeight || 500}
        underline={l.underline || "hover"}
        variant={l.variant || "plain"}
        sx={sx}
        key={l.id}
      >
        {renderDecorator(l.decorator, cardName)}
        {l.label}
      </Link>
    )
  }

  function renderLast(l: BreadCrumb) {
    return (
      <Typography color={l.color || "neutral"} fontWeight={500} fontSize={12}>
        {l.label}
      </Typography>
    )
  }

  return (
    <Box sx={joy?.sx?.root || DEF_ROOT_SX} data-pihanga={cardName}>
      <Breadcrumbs
        size="sm"
        aria-label="breadcrumbs"
        separator={<ChevronRightRoundedIcon fontSize="small" />}
        sx={{ pl: 0 }}
      >
        {links.map(renderLink)}
        {renderLast(last)}
      </Breadcrumbs>
    </Box>
  )
}
