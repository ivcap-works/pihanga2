import React from "react"
import { PiCardProps } from "@pihanga2/core"
import { ComponentEvents, IconButtonProps } from "./iconButton.types"
import { IconButton, Tooltip } from "@mui/joy"
import { getIcon } from "@pihanga2/cards"
import { SxProps } from "@mui/joy/styles/types"

export type ComponentProps = IconButtonProps & {
  joy?: {
    sx?: {
      root?: SxProps
    }
  }
}

const DEF_SX = {
  root: {
    // "--IconButton-size": "37px"
  }
}

export const Component = (
  props: PiCardProps<ComponentProps, ComponentEvents>,
): React.ReactNode => {
  const {
    iconID,
    ariaLabel,
    tooltip,
    isDisabled,
    size,
    color,
    variant,
    onClicked,
    joy,
    cardName,
  } = props

  const renderButton = () => (
    <IconButton
      aria-label={ariaLabel}
      onClick={() => onClicked({})}
      color={color}
      disabled={isDisabled}
      variant={variant}
      size={size}
      data-pihanga={cardName}
      sx={joy?.sx?.root || DEF_SX.root}
    >
      {iconID ? getIcon(iconID) : null}
    </IconButton>
  )

  return (
    <>
      {tooltip && (
        <Tooltip arrow title={tooltip}>
          {renderButton()}
        </Tooltip>
      )}
      {!tooltip && renderButton()}
    </>
  )
}
