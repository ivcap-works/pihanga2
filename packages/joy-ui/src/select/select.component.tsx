import React from "react"
import { Card, isCardRef, PiCardProps } from "@pihanga2/core"
import { SelectEvents, SelectOptionT, SelectProps, TabT } from "@pihanga2/cards"
import Select from "@mui/joy/Select"
import { renderDecorator } from "../utils"
import { DEF_SX, SelectSX } from "./select.sx"
import Option from "@mui/joy/Option"
import TabPanel from "@mui/joy/TabPanel"

export const Component = (
  props: PiCardProps<SelectProps, SelectEvents>,
): React.ReactNode => {
  const {
    options,
    value,
    defaultValue,
    placeholder,
    required,
    multiple,
    defaultListboxOpen,
    color,
    disabled,
    variant,
    size,
    startDecorator,
    endDecorator,
    ariaLabel,

    onChange,
    onOpen,
    onClose,

    style,
    className,
    cardName,
    _cls,
  } = props

  let sx: SelectSX = style?.joy || {}

  function onChangeHandler(ev: unknown, value: string | string[] | null) {
    onChange({ optionID: value })
  }

  function onCloseHandler() {
    onClose({})
  }

  function onOpenHandler() {
    onOpen({})
  }

  function renderOption(opt: SelectOptionT) {
    const p = {
      value: opt.id,
      color: opt.color,
      disabled: opt.disabled,
      sx: { ...DEF_SX.option, ...sx.option },
    }
    return (
      <Option {...p} key={opt.id}>
        {isCardRef(opt.label) ? (
          <Card cardName={opt.label} parentCard={cardName} />
        ) : (
          (opt.label as string)
        )}
      </Option>
    )
  }

  const p = {
    value,
    defaultValue,
    placeholder,
    required,
    multiple,
    defaultListboxOpen,
    color,
    disabled,
    variant,
    size,
    startDecorator: renderDecorator(startDecorator, cardName),
    endDecorator: renderDecorator(endDecorator, cardName),
    sx: { ...DEF_SX.root, ...sx.root },
  }

  return (
    <Select
      aria-label={ariaLabel}
      {...p}
      onChange={onChangeHandler}
      onClose={onCloseHandler}
      onListboxOpenChange={onOpenHandler}
      className={className}
      data-pihanga={cardName}
    >
      {options.map(renderOption)}
    </Select>
  )
}
