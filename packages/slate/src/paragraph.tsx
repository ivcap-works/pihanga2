import React from "react"
import { BlockT, ParagraphT } from "./slate.types"

export function renderParagraph(
  p: ParagraphT,
  attributes: any,
  children: any,
): JSX.Element {
  return (
    <p className={p.klass} style={p.style} {...attributes}>
      {children}
    </p>
  )
}

export function renderBlock(
  b: BlockT,
  attributes: any,
  children: any,
): JSX.Element {
  return (
    <div className={b.klass} style={b.style} {...attributes}>
      {children}
    </div>
  )
}
