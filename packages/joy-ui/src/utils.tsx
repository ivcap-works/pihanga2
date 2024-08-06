import React from "react"
import { Avatar, Chip } from "@mui/joy"
import { getIcon } from "@pihanga2/cards"
import { DecoratorT, DecoratorE } from "@pihanga2/cards"
import { Card } from "@pihanga2/core"

export function renderDecorator(
  d?: DecoratorT,
  parentCard?: string,
): React.ReactNode {
  if (!d) return null
  switch (d.type) {
    case DecoratorE.Icon:
      // @ts-ignore.
      const sx = d.sx
      return getIcon(d.icon, { fontSize: d.fontSize, color: d.color, sx })
    case DecoratorE.Avatar:
      return <Avatar size={d.size} src={d.src} />
    case DecoratorE.Chip:
      return (
        <Chip size="sm" color="primary" variant="solid">
          {d.text}
        </Chip>
      )
    case DecoratorE.Card:
      return <Card cardName={d.cardName} parentCard={parentCard || ""} />

    default:
      throw new Error("Missing implementation for decorator")
  }
}
