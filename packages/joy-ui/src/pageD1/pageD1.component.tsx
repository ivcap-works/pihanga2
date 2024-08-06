import * as React from "react"
import Box from "@mui/joy/Box"
import { PiCardProps, Card, PiCardRef } from "@pihanga2/core"
import { CssBaseline, CssVarsProvider } from "@mui/joy"
import { PageD1Props } from "@pihanga2/cards"
import { SxProps } from "@mui/material"
import { JyColorSchemeToggle } from "../colorSchemeToggle"

type Style = {
  joy: {
    outer: SxProps
    inner: SxProps
  }
}

type ComponentProps = PageD1Props<Style>

export const Component = (
  props: PiCardProps<ComponentProps>,
): React.ReactNode => {
  const {
    contentCards = [],
    hideColorSchemeToggle,
    className,
    style,
    theme,
    cardName,
  } = props

  const sx: SxProps = {
    height: "100vh",
    overflowY: "scroll",
    scrollSnapType: "y mandatory",
    "& > div": {
      scrollSnapAlign: "start",
    },
    ...style?.joy?.inner,
  }

  function renderContent(cardRef: PiCardRef, idx: number) {
    return (
      <Card
        cardName={cardRef}
        parentCard={cardName}
        key={getCardKey(cardRef, idx)}
      />
    )
  }

  function getCardKey(cardRef: PiCardRef, idx: number) {
    const ref = cardRef as any
    const key = ref instanceof String ? ref : ref.id ?? `k${idx}`
    return key
  }

  function renderColorSchemeToggle() {
    if (hideColorSchemeToggle) return null
    return <Card cardName={JyColorSchemeToggle({})} parentCard={cardName} />
  }

  return (
    <Box sx={style?.joy?.outer} data-pihanga={cardName}>
      {renderColorSchemeToggle()}
      <Box sx={sx}>{contentCards.map(renderContent)}</Box>
    </Box>
  )
}
