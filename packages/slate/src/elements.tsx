import React from "react"
import { renderBlock, renderParagraph } from "./paragraph"
import { renderHeading } from "./heading"
import { renderList, renderListElement } from "./list"
import { ElementT, LeafT, LType, NodeT, NType } from "./slate.types"
import { RenderElementProps, RenderLeafProps } from "slate-react"
import { renderText } from "./text"

export function registerCustomElement(name: string, mapper: elementMapperF) {
  customElements[name] = mapper
}

const customElements: { [k: string]: elementMapperF } = {}

type elementMapperF = (
  element: any, // T extends NodeT
  attribute: any,
  children: any,
) => JSX.Element

//*** NODES  */

type NodeMappingT = {
  [K in NType]: elementMapperF
}

const nodeMappers: NodeMappingT = {
  [NType.Paragraph]: renderParagraph,
  [NType.Block]: renderBlock,
  [NType.List]: renderList,
  [NType.ListElement]: renderListElement,
  [NType.Heading]: renderHeading,
  [NType.CustomNode]: renderCustomNode,
}

export function renderElement(props: RenderElementProps): JSX.Element {
  const { element, attributes, children } = props
  let type = (element as any).type as NType
  if (!type) {
    console.warn("Missing type for slate element", element)
    type = NType.Paragraph
  }
  const f = nodeMappers[type]
  if (f) {
    return f(element, attributes, children)
  } else {
    return renderCustomNode(element, attributes, children)
  }
}

export function renderCustomNode(
  element: any,
  attributes: any,
  children: any,
): JSX.Element {
  const subType = element.subType

  if (subType) {
    let renderer = customElements[element.subType]
    if (renderer) {
      return renderer(element, attributes, children)
    }
  }
  console.warn("no mapper for element", element)
  return (
    <div style={errorStyle}>Unknown element '{subType || element.type}'</div>
  )
}

//*** LEAVES */

type LeafMappingT = {
  [K in LType]: elementMapperF
}

const leafMappers: LeafMappingT = {
  [LType.Text]: renderText,
  [LType.CustomLeaf]: renderCustomNode,
}

export function renderLeaf(props: RenderLeafProps): JSX.Element {
  const { leaf, attributes, children } = props
  let type = (leaf as any).type as LType
  if (!type) {
    console.warn("Missing type for slate leaf", leaf)
    type = LType.Text
  }
  const f = leafMappers[type]
  if (f) {
    return f(leaf, attributes, children)
  } else {
    console.warn("no mapper for leaf", type)
    return <span style={errorStyle}>Unknown leaf type '{type}'</span>
  }
}

const errorStyle = { backgroundColor: "lightsalmon" }

export function sanitize(l: ElementT[]): ElementT[] {
  return l.map((e) => {
    if ((e as any).text) {
      return e // text node
    }
    const children = (e as NodeT).children
    if (children) {
      return { ...e, children: sanitize(children) } as NodeT
    } else {
      // is supposed to be element, but looks like leaf
      return { ...e, children: emptyLeaf } as NodeT
    }
  })
}

const emptyLeaf: LeafT[] = [{ type: LType.Text, text: "" }]
