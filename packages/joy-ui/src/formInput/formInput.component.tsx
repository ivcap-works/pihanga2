import React, { useMemo } from "react"
import throttle from "lodash.throttle"

import { Card, PiCardDef, PiCardProps, isCardRef } from "@pihanga2/core"
import { DEF_THROTTLE_WAIT, FormInputEvents, FormInputProps } from "@pihanga2/cards/src/formInput"
import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Tooltip,
} from "@mui/joy"
import { renderDecorator } from "../utils"

type ChangeEvent = React.ChangeEvent<HTMLInputElement>
type ChangeHandlerF = (ev: ChangeEvent) => void

export const Component = (
  props: PiCardProps<FormInputProps, FormInputEvents>,
): React.ReactNode => {
  const {
    name,
    label,
    value,
    defaultValue,
    reportChange,
    throttleWait = DEF_THROTTLE_WAIT,
    required,
    inError,
    helperText,
    isDisabled,
    placeholder,
    tooltip,
    size,
    fullWidth,
    color,
    variant,
    startDecorator,
    endDecorator,
    style,
    className,
    onChange,
    cardName,
    _cls,
  } = props

  const changeHandler = useMemo<ChangeHandlerF>(() => {
    return throttle<ChangeHandlerF>((ev: ChangeEvent) => {
      onChange({ value: ev.target.value })
    }, throttleWait)
  }, [])

  const control: any = {
    disabled: isDisabled,
    required,
    error: inError,
    color,
    size,
    variant,
    fullWidth,

    sx: style?.joy?.control,
    className: `${_cls("root")} ${className}`,
  }

  const input: any = {
    name,
    defaultValue,
    placeholder,
    startDecorator: renderDecorator(startDecorator, cardName),
    endDecorator: renderDecorator(endDecorator, cardName),
  }
  if (reportChange) {
    input.onChange = changeHandler
  }

  function renderForm() {
    return (
      <FormControl {...control} data-pihanga={cardName}>
        {label && <FormLabel>{label}</FormLabel>}
        <Input {...input} value={value} />
        {helperText && (
          <FormHelperText>{renderHelp(helperText)}</FormHelperText>
        )}
      </FormControl>
    )
  }

  function renderHelp(help: string | PiCardDef) {
    if (isCardRef(help)) {
      return <Card cardName={help} parentCard={cardName} />
    } else {
      return <>{helperText}</>
    }
  }

  return (
    <>
      {tooltip && (
        <Tooltip arrow title={tooltip}>
          {renderForm()}
        </Tooltip>
      )}
      {!tooltip && renderForm()}
    </>
  )
}
