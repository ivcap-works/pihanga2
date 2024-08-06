import React from "react"
import { Card, PiCardProps } from "@pihanga2/core"
import { Link, Tooltip, Typography } from "@mui/joy"

import { LinkEvents, LinkProps } from "@pihanga2/cards"
import { SxProps } from "@mui/joy/styles/types"
import { renderDecorator } from "../utils"

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
  props: PiCardProps<ComponentPropse, LinkEvents>,
): React.ReactNode => {
  const {
    text,
    href,
    childCard,
    level,
    overlay,
    underline,
    tooltip,
    isDisabled,
    color,
    variant,
    startDecorator,
    endDecorator,
    noWrap,
    textColor,
    fontSize,
    fontWeight,
    onClicked,
    joy,
    cardName,
    _cls,
    _dispatch,
  } = props

  const p: any = {
    level,
    overlay,
    underline,
    disable: isDisabled,
    // color,
    variant,
    // startDecorator,
    // endDecorator,
    sx: joy?.sx?.root || DEF_SX.root,
  }
  if (href) {
    p.href = href
  } else {
    p.component = "button"
    p.onClick = onClicked
  }

  function onClick() {
    onClicked(href ? { href } : {})
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
      return renderTypography()
    }
  }

  function renderTypography() {
    const p = {
      noWrap,
      level,
      color,
      variant,
      startDecorator: renderDecorator(startDecorator, cardName),
      endDecorator: renderDecorator(endDecorator, cardName),
      textColor,
      fontSize,
      fontWeight,
    }
    return <Typography {...p}>{text}</Typography>
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
