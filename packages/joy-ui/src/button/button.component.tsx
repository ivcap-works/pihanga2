import React from "react"
import { PiCardProps } from "@pihanga2/core"
import { ButtonEvents, ButtonProps } from "@pihanga2/cards"
import { Button, Tooltip } from "@mui/joy"
import { renderDecorator } from "../utils"

export const Component = (
  props: PiCardProps<ButtonProps, ButtonEvents>,
): React.ReactNode => {
  const {
    label,
    tooltip,
    isDisabled,
    isLoading,
    loadingPosition,
    size,
    fullWidth,
    color,
    variant,
    isSubmit,
    isLink,
    startDecorator,
    endDecorator,
    style,
    className,
    onClicked,
    cardName,
    _cls,
  } = props

  const p: any = {
    color,
    disabled: isDisabled,
    loading: isLoading,
    loadingPosition,
    variant,
    startDecorator: renderDecorator(startDecorator, cardName),
    endDecorator: renderDecorator(endDecorator, cardName),
    size,
    fullWidth,

    sx: style?.joy,
    className: `${_cls("root")} ${className}`,
  }
  if (isSubmit) p.type = "submit"
  if (isLink) p.component = "a"

  function onClick() {
    onClicked({})
  }

  const renderButton = () => (
    <Button {...p} onClick={onClick} data-pihanga={cardName}>
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
