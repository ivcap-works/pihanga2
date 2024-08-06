import React from "react"
import { Card, PiCardProps } from "@pihanga2/core"
import { ButtonGroupProps } from "@pihanga2/cards"
import { ButtonGroup } from "@mui/joy"
import { SxProps } from "@mui/joy/styles/types"

export type ComponentProps = ButtonGroupProps & {
  joy?: {
    sx?: {
      root?: SxProps
    }
  }
}

export const DEF_SX = {
  root: {
    // --ButtonGroup-radius
  },
}

export const Component = (
  props: PiCardProps<ComponentProps>,
): React.ReactNode => {
  const {
    buttons,
    ariaLabel,
    isDisabled,
    size,
    color,
    variant,
    orientation,
    spacing,
    buttonFlex,
    joy,
    cardName,
  } = props

  return (
    <ButtonGroup
      aria-label={ariaLabel}
      disabled={isDisabled}
      spacing={spacing}
      orientation={orientation}
      color={color}
      variant={variant}
      size={size}
      buttonFlex={buttonFlex}
      sx={joy?.sx?.root || DEF_SX.root}
      data-pihanga={cardName}
    >
      {buttons.map((b, idx) => (
        <Card cardName={b} key={idx} parentCard={cardName} />
      ))}
    </ButtonGroup>
  )
}
