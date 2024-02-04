import React from "react"
import { Avatar, Chip } from "@mui/joy"
import { getIcon } from "@pihanga/cards/dist/icons"
import { DecoratorT, DecoratorE } from "@pihanga/cards/src"


export function renderDecorator(d?: DecoratorT): React.ReactNode {
  if (!d) return null
  switch (d.type) {
    case DecoratorE.Icon:
      // @ts-ignore.
      const sx = d.sx
      return getIcon(d.icon, { fontSize: d.fontSize, sx })
    case DecoratorE.Avatar:
      return <Avatar size={d.size} src={d.src} />
    case DecoratorE.Chip:
      return (
        <Chip size="sm" color="primary" variant="solid">
          {d.text}
        </Chip>
      )

    default:
      throw new Error("Missing implementation for decorator")
  }
}
