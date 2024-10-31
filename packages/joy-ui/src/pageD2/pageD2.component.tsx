import * as React from "react"
import Box from "@mui/joy/Box"
import Typography from "@mui/joy/Typography"
import { Card, PiCardProps } from "@pihanga2/core"
import { SxProps } from "@mui/material"
import { PageD2Props } from "@pihanga2/cards"

type Style = {
  joy: {
    sx: {
      root?: SxProps
      main?: SxProps
      header?: SxProps
    }
  }
}

export const DEF_ROOT_SX: SxProps = { display: "flex", minHeight: "100dvh" }
export const DEF_MAIN_SX: SxProps = {
  px: { xs: 2, md: 6 },
  pt: {
    xs: "calc(12px + var(--Header-height))",
    sm: "calc(12px + var(--Header-height))",
    md: 3,
  },
  pb: { xs: 2, sm: 2, md: 3 },
  flex: 1,
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
  height: "100dvh",
  gap: 1,
}
export const DEF_HEADER_SX: SxProps = {
  display: "flex",
  mb: 1,
  gap: 1,
  flexDirection: { xs: "column", sm: "row" },
  alignItems: { xs: "start", sm: "center" },
  flexWrap: "wrap",
  justifyContent: "space-between",
}

type ComponentProps = PageD2Props<Style>

export const Component = (
  props: PiCardProps<ComponentProps>,
): React.ReactNode => {
  const {
    pageTitle,
    headerCard,
    sidebarCard,
    breadcrumbsCard,
    actionCard,
    contentCard,
    modalCard,
    style,
    cardName,
  } = props
  const sx = style?.joy?.sx
  const rootSx = { ...DEF_ROOT_SX, ...sx?.root }
  const mainSx = { ...DEF_MAIN_SX, ...sx?.main }
  const headerSx = { ...DEF_HEADER_SX, ...sx?.header }

  return (
    <Box sx={rootSx} data-pihanga={cardName}>
      {modalCard && <Card cardName={modalCard} parentCard={cardName} />}
      {headerCard && <Card cardName={headerCard} parentCard={cardName} />}
      <Card cardName={sidebarCard} parentCard={cardName} />
      <Box component="main" className="MainContent" sx={mainSx}>
        {breadcrumbsCard && (
          <Card cardName={breadcrumbsCard} parentCard={cardName} />
        )}
        <Box sx={headerSx}>
          <Typography level="h2" component="h1">
            {pageTitle}
          </Typography>
          {actionCard && <Card cardName={actionCard} parentCard={cardName} />}
        </Box>
        <Card cardName={contentCard} parentCard={cardName} />
      </Box>
    </Box>
  )
}
