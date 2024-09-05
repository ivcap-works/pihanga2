import React from "react"
import { slate_attribute, TextT } from "./slate.types"

export function renderText(
  leaf: TextT,
  attributes: any,
  children: any,
): JSX.Element {
  // const style = { fontWeight: leaf.bold ? "bold" : "normal" }
  const style = {
    whiteSpace: "pre-line",
    ...leaf.style,
  }
  return (
    <span
      {...attributes}
      style={style}
      className={leaf.klass}
      {...slate_attribute(leaf.id)}
    >
      {children}
    </span>
  )
}
