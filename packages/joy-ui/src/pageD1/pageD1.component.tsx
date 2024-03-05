import * as React from "react"
import Box from "@mui/joy/Box"
import Typography from "@mui/joy/Typography"

// import OrderList from "../../../components/OrderList"
import { Card, PiCardProps } from "@pihanga2/core"
import { ComponentProps, DEF_ROOT_SX } from "./pageD1.types"

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
    joy,
    cardName,
  } = props
  return (
    <Box sx={joy?.sx?.root || DEF_ROOT_SX} data-pihanga={cardName}>
      {modalCard && <Card cardName={modalCard} parentCard={cardName} />}
      <Card cardName={headerCard} parentCard={cardName} />
      <Card cardName={sidebarCard} parentCard={cardName} />
      <Box
        component="main"
        className="MainContent"
        sx={{
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
        }}
      >
        <Card cardName={breadcrumbsCard} parentCard={cardName} />
        <Box
          sx={{
            display: "flex",
            mb: 1,
            gap: 1,
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "start", sm: "center" },
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          <Typography level="h2" component="h1">
            {pageTitle}
          </Typography>
          {actionCard && <Card cardName={actionCard} parentCard={cardName} />}
        </Box>
        <Card cardName={contentCard} parentCard={cardName} />
        {/* <OrderTable /> */}
        {/* <OrderList /> */}
      </Box>
    </Box>
  )
}
