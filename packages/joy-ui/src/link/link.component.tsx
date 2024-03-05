import React from "react"
import { Card, PiCardProps } from "@pihanga2/core"
import { Link, Tooltip } from "@mui/joy"

import { ComponentEvents, LinkProps } from "@pihanga2/cards/src/link"
import { SxProps } from "@mui/joy/styles/types"

export type ComponentPropse = LinkProps & {
  joy?: {
    sx?: {
      root?: SxProps
    }
  }
}

export const DEF_SX: { [k: string]: SxProps } = {
  root: {
    // { '--Link-gap': '0.5rem', pl: 1, py: 0.5, borderRadius: 'md'
  },
}

export const Component = (
  props: PiCardProps<ComponentPropse, ComponentEvents>,
): React.ReactNode => {
  const {
    text,
    href,
    childCard,
    level,
    underline,
    tooltip,
    isDisabled,
    size,
    color,
    variant,
    startDecorator,
    endDecorator,
    actionMapper,
    onClicked,
    joy,
    cardName,
    _cls,
    _dispatch,
  } = props

  const p: any = {
    level,
    underline,
    disable: isDisabled,
    size,
    color,
    variant,
    startDecorator,
    endDecorator,
    sx: joy?.sx?.root || DEF_SX.root,
  }
  if (href) {
    p.href = href
  } else {
    p.component = "button"
    p.onClick = onClicked
  }

  function onClick() {
    if (actionMapper) {
      _dispatch(actionMapper(props))
    } else {
      onClicked(href ? { href } : {})
    }
  }

  const renderLink = () => (
    <Link
      {...p}
      data-pihanga={cardName}
      className={_cls("root")}
      onClick={onClick}
    >
      {renderChild()}
    </Link>
  )

  function renderChild() {
    if (childCard) {
      return <Card cardName={childCard} parentCard={cardName} />
    } else {
      return text
    }
  }

  return (
    <>
      {tooltip && (
        <Tooltip arrow title={tooltip}>
          {renderLink()}
        </Tooltip>
      )}
      {!tooltip && renderLink()}
    </>
  )
}
