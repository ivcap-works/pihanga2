import { Card, PiCardProps } from "@pihanga2/core"
import React from "react"
import CircularProgress from "@mui/joy/CircularProgress"
import { SxProps } from "@mui/joy/styles/types"
import { DEF_SPINNER_HEIGHT, SpinnerProps } from "@pihanga2/cards/src/spinner"
import Box from "@mui/joy/Box"

export type ComponentProps = SpinnerProps & {
  joy?: {
    sx?: {
      root: SxProps
    }
  }
}

const DEF_SX = {
  root: {
    display: "flex",
    gap: 2,
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
  },
}

export const SpinnerComponent = (
  props: PiCardProps<ComponentProps>,
): React.ReactNode => {
  const {
    childCard,
    height = DEF_SPINNER_HEIGHT,
    value,
    thickness,
    color,
    variant,
    joy,
    cardName,
    _cls,
  } = props
  const sx = joy?.sx || DEF_SX
  const p: { [k: string]: any } = { color, variant }
  if (value) {
    p["value"] = value
    p["determinate"] = true
  }
  if (thickness) {
    p["thickness"] = thickness
  }
  const style = { height }
  return (
    <Box
      sx={sx.root}
      style={style}
      data-pihanga={cardName}
      className={_cls("root")}
    >
      <CircularProgress {...p}>
        {childCard && <Card cardName={childCard} parentCard={cardName} />}
      </CircularProgress>
    </Box>
  )
}
