import React from "react"
import { useColorScheme } from "@mui/joy/styles"
import { Card, PiCardProps } from "@pihanga2/core"
import {
  ComponentEvents,
  ColorSchemeToggleProps,
} from "./colorSchemeToggle.types"
import { registerMuiIcon } from "../icons"

import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded"
import LightModeIcon from "@mui/icons-material/LightMode"
import { SxProps } from "@mui/joy/styles/types"
import { JyIconButton } from "../iconButton"

export const DARK_ICON_NAME = registerMuiIcon(DarkModeRoundedIcon)
export const LIGHT_ICON_NAME = registerMuiIcon(LightModeIcon)

export const DEF_SX = {
  root: {},
}

export type ComponentProps = ColorSchemeToggleProps & {
  joy?: {
    sx?: {
      root?: SxProps
    }
  }
}
export const Component = (
  props: PiCardProps<ComponentProps, ComponentEvents>,
): React.ReactNode => {
  const { lightIcon, darkIcon, cardName, joy } = props
  // const { onClick, sx, ...other } = props
  const { mode, setMode } = useColorScheme()
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    // console.log(">>> MOUNTED")
    setMounted(true)
    setMode("light") // default
  }, [setMode])
  // console.log(">>> IS MOUNTED", mounted)
  if (!mounted) {
    return null
  }

  const iconID =
    mode === "light" ? lightIcon ?? LIGHT_ICON_NAME : darkIcon ?? DARK_ICON_NAME
  const p = JyIconButton({
    iconID,
    ariaLabel: `color schema toggle is set to '${mode}'`,
    size: "sm",
    variant: "outlined",
    color: "neutral",
    onClicked: (s) => {
      console.log(">>>> MODE", mode, mode === "light")
      if (mode === "light") {
        console.log(">>>> MODE set to 'dark'")
        setMode("dark")
      } else {
        console.log(">>>> MODE set to 'light'")
        setMode("light")
      }
      return s
    },
    joy,
  })
  return <Card cardName={p} parentCard={cardName} key={"active"} />
  // return (
  //   <IconButton
  //     id="toggle-mode"
  //     size="sm"
  //     variant="outlined"
  //     color="neutral"
  //     {...other}
  //     onClick={(event) => {
  //       if (mode === "light") {
  //         setMode("dark")
  //       } else {
  //         setMode("light")
  //       }
  //       onClick?.(event)
  //     }}
  //     sx={[
  //       {
  //         "& > *:first-child": {
  //           display: mode === "dark" ? "none" : "initial",
  //         },
  //         "& > *:last-child": {
  //           display: mode === "light" ? "none" : "initial",
  //         },
  //       },
  //       ...(Array.isArray(sx) ? sx : [sx]),
  //     ]}
  //   >
  //     <DarkModeRoundedIcon />
  //     <LightModeIcon />
  //   </IconButton>
  // )
}
