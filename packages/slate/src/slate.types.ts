import {
  createCardDeclaration,
  createOnAction,
  registerActions,
} from "@pihanga2/core"
import { CSSProperties } from "react"

export const SLATE_CARD = "slate"
export const SlateEditor = createCardDeclaration<SlateProps, ComponentEvents>(
  SLATE_CARD,
)

export const SLATE_ID_ATTRIBUTE = "data-pihanga-slate-id"

export const slate_attribute = (id: any) => {
  const h = {} as { [k: string]: string }
  h[SLATE_ID_ATTRIBUTE] = id
  return h
}

export const SLATE_ACTION = registerActions(SLATE_CARD, [
  "element_clicked",
  "element_entered",
  "element_left",
])

export type SlateProps = {
  value?: ElementT[]
  initialValue?: ElementT[]
  readonly?: boolean
  style?: {
    outer?: CSSProperties
    // sx?: {
    //   root?: SxProps
    // }
  }
}

export enum NType {
  Paragraph = "paragraph",
  Block = "block",
  Heading = "heading",
  List = "list",
  ListElement = "list/element",
  CustomNode = "node/custom",
}

export enum LType {
  Text = "text",
  CustomLeaf = "leaf/custom",
}

export function text(text: string, props?: BasePropsT): TextT {
  let { id, klass, style } = props || {}
  return {
    type: LType.Text,
    text,
    id,
    style,
    klass,
  }
}

export type NodeT =
  | ParagraphT
  | BlockT
  | HeadingT
  | ListT
  | ListElementT
  | CustomNodeT

export type LeafT = TextT | CustomLeafT
export type ElementT = NodeT | LeafT

export type BasePropsT = {
  id?: string | number
  style?: CSSProperties
  klass?: string
}

export type BaseElementT = BasePropsT & {
  type: string
}

export type ParagraphT = BaseElementT & {
  type: NType.Paragraph
  children: ElementT[]
}

export type BlockT = BaseElementT & {
  type: NType.Block
  children: ElementT[]
}

export type HeadingT = BaseElementT & {
  type: NType.Heading
  level?: number
  children: LeafT[]
}

export type ListT = BaseElementT & {
  type: NType.List
  listType?: ListTypeE
  isUnordered?: boolean
  children: ListElementT[]
}

export enum ListTypeE {
  LowerCaseLetter = "a", //  lowercase letters,
  UpperCaseLetter = "A", //  uppercase letters
  LowerCaseRoman = "i", //  lowercase letters,
  UpperCaseRoman = "I", //  uppercase letters
  Number = "1", //numbers
}

export type ListElementT = BaseElementT & {
  type: NType.ListElement
  skipEnumerate?: boolean
  children: ElementT[]
}

export type CustomNodeT<P = { [k: string]: any }> = BaseElementT & {
  type: NType.CustomNode
  subType: string
  props?: P
  children: ElementT[]
}

//**** LEAVES */

export type TextT = BaseElementT & {
  type: LType.Text
  text: string
}

export type CustomLeafT<P = { [k: string]: any }> = BaseElementT & {
  type: LType.CustomLeaf
  subType: string
  text: string
  props?: P
}

export const onElementSelected = createOnAction<EditorElementEvent>(
  SLATE_ACTION.ELEMENT_CLICKED,
)

export const onElementEntered = createOnAction<EditorElementEvent>(
  SLATE_ACTION.ELEMENT_ENTERED,
)

export const onElementLeft = createOnAction<EditorElementEvent>(
  SLATE_ACTION.ELEMENT_LEFT,
)

export type EditorElementEvent = {
  elementID: string
}

export type ComponentEvents = {
  onElementClicked: EditorElementEvent
  onElementEntered: EditorElementEvent
  onElementLeft: EditorElementEvent
}
