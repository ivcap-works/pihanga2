import React from "react"
import { HeadingT } from "./slate.types"

export function renderHeading(
  element: HeadingT,
  attributes: any,
  children: any,
): JSX.Element {
  const level = element.level || 1
  return React.createElement("h" + level, attributes, children)
}
