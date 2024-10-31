import React from "react"
import { PiCardProps } from "@pihanga2/core"
import { InputEvents, InputProps } from "@pihanga2/cards"
import { Input } from "@mui/joy"
import { renderDecorator } from "../utils"

export type JyInputProps = InputProps

export const InputComponent = (
  props: PiCardProps<JyInputProps, InputEvents>,
): React.ReactNode => {
  const { debounceTimeout, onChange, style, className, cardName } = props
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  )
  const p = {
    name: props.name,
    required: props.required,
    placeholder: props.placeholder,
    fullWidth: props.fullWidth,
    error: props.error,
    color: props.color,
    size: props.size,
    variant: props.variant,
    startDecorator: renderDecorator(props.startDecorator, cardName),
    endDecorator: renderDecorator(props.endDecorator, cardName),
    sx: style?.joy,
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (debounceTimeout === undefined) return

    const e = { value: event.target.value }
    if (debounceTimeout > 0) {
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        onChange(e)
      }, debounceTimeout)
    } else {
      onChange(e)
    }
  }

  return (
    <Input
      {...p}
      onChange={handleChange}
      className={className}
      data-pihanga={cardName}
    />
  )
}
