import React from "react"
import { PiCardProps } from "@pihanga2/core"
import GlobalStyles from "@mui/joy/GlobalStyles"
import Sheet from "@mui/joy/Sheet"
import IconButton from "@mui/joy/IconButton"
import MenuIcon from "@mui/icons-material/Menu"
import { Interpolation } from "@mui/material"
import { Theme, Typography } from "@mui/joy"
import { SxProps } from "@mui/material"

import { ComponentEvents, HeaderProps } from "./header.types"

export type ComponentProps = HeaderProps & {
  joy?: {
    sx?: {
      root?: SxProps
      title?: SxProps
    }
    globalStyles?: Interpolation<Theme>
  }
}

export const DEF_SX = {
  root: {
    display: { xs: "flex", md: "none" },
    alignItems: "center",
    justifyContent: "space-between",
    position: "fixed",
    top: 0,
    width: "100vw",
    height: "var(--Header-height)",
    zIndex: 9995,
    p: 2,
    gap: 1,
    borderBottom: "1px solid",
    borderColor: "background.level1",
    boxShadow: "sm",
  },
  title: {
    flexGrow: 2,
  },
}

export const DEF_GLOBAL_STYLES: Interpolation<Theme> = (theme: Theme) => ({
  ":root": {
    "--Header-height": "52px",
    [theme.breakpoints.up("md")]: {
      "--Header-height": "0px",
    },
  },
})

export const Component = (
  props: PiCardProps<ComponentProps, ComponentEvents>,
): React.ReactNode => {
  const { title, joy, onMenuClicked, cardName } = props

  function onMenuButtonClick() {
    // toggleSidebar()
    onMenuClicked({})
  }

  return (
    <Sheet sx={joy?.sx?.root || DEF_SX.root} data-pihanga={cardName}>
      <GlobalStyles styles={joy?.globalStyles || DEF_GLOBAL_STYLES} />
      <IconButton
        onClick={onMenuButtonClick}
        variant="outlined"
        color="neutral"
        size="sm"
      >
        <MenuIcon />
      </IconButton>
      {title && (
        <Typography level="title-lg" sx={joy?.sx?.title || DEF_SX.title}>
          {title}
        </Typography>
      )}
    </Sheet>
  )
}
