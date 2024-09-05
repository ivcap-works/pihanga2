import React from "react"
import { ListElementT, ListT } from "./slate.types"

export function renderList(
  node: ListT,
  attributes: any,
  children: any,
): JSX.Element {
  let le = node.isUnordered ? "ul" : "ol"
  const styles = {
    ...attributes,
    type: node.listType,
  }
  return React.createElement(le, styles, children)
}

export function renderListElement(
  node: ListElementT,
  attributes: any,
  children: any,
): JSX.Element {
  let le = "li"
  let style: any = {}
  if (node.skipEnumerate) {
    style["list-style-type"] = "none"
  }
  return React.createElement(le, { ...attributes, style }, children)
}
