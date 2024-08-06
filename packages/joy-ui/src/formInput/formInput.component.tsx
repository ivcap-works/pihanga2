import React, { useMemo, useState } from "react"
import throttle from "lodash.throttle"

import { Card, PiCardDef, PiCardProps, isCardRef } from "@pihanga2/core"
import {
  DEF_THROTTLE_WAIT,
  FormInputEvents,
  FormInputProps,
} from "@pihanga2/cards"
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
    version,
    defaultValue,
    reportChange,
    clearOnSubmit,
    throttleWait = DEF_THROTTLE_WAIT,
    required,
    inError,
    helperText,
    isDisabled,
    placeholder,
    tooltip,
    size,
    color,
    variant,
    startDecorator,
    endDecorator,
    style,
    className,
    onChange,
    onSubmit,
    cardName,
    _cls,
  } = props
  const [currentVersion, setVersion] = useState<string | number>("")
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const changeHandler = useMemo<ChangeHandlerF>(() => {
    return throttle<ChangeHandlerF>((ev: ChangeEvent) => {
      onChange({ value: ev.target.value })
    }, throttleWait)
  }, [])

  if (version && currentVersion !== version) {
    if (!value && inputRef.current) {
      // reset input value
      inputRef.current.value = ""
    }
    setVersion(version)
  }

  const control: any = {
    disabled: isDisabled,
    required,
    error: inError,
    color,
    size,
    variant,
    // fullWidth,

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

  input.slotProps = {
    input: {
      ref: inputRef,
      onKeyUp: (ev: React.KeyboardEvent<HTMLInputElement>) => {
        if (ev.code === "Enter") {
          const el = ev.target as any
          const value = el.value
          if (clearOnSubmit) {
            el.value = ""
          }
          onSubmit({ value })
        }
      },
    },
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
