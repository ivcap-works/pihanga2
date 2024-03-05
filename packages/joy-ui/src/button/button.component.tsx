import React from "react"
import { PiCardProps } from "@pihanga2/core"
import { ComponentEvents, ButtonProps } from "@pihanga2/cards/src/button"
import { Button, Tooltip } from "@mui/joy"
import { renderDecorator } from "../utils"
import { SxProps } from "@mui/material"

export type ComponentProps = ButtonProps & {
  joy?: {
    sx?: {
      root?: SxProps
    }
  }
}

export const Component = (
  props: PiCardProps<ComponentProps, ComponentEvents>,
): React.ReactNode => {
  const {
    label,
    tooltip,
    isDisabled,
    isLoading,
    loadingPosition,
    size,
    color,
    variant,
    startDecorator,
    endDecorator,
    onClicked,
    joy,
    cardName,
    _cls,
  } = props

  function onClick() {
    onClicked({})
  }

  const renderButton = () => (
    <Button
      onClick={onClick}
      color={color}
      disabled={isDisabled}
      loading={isLoading}
      loadingPosition={loadingPosition}
      variant={variant}
      startDecorator={renderDecorator(startDecorator)}
      endDecorator={renderDecorator(endDecorator)}
      size={size}
      data-pihanga={cardName}
      sx={joy?.sx?.root}
      className={_cls("root")}
    >
      {label}
    </Button>
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
