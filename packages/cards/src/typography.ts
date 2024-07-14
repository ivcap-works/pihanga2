import { PiCardRef, createCardDeclaration } from "@pihanga2/core"
import { ColorT, VariantT, DecoratorT, SizeT, TypographyLevelT, AlignTextT } from "./common"

export const TYPOGRAPHY_CARD = "typography"
export const Typography =
  createCardDeclaration<TypographyProps>(TYPOGRAPHY_CARD)

export type TypographyProps = {
  // three different ways to define content
  text?: string
  childCard?: PiCardRef
  paragraph?: (string | TypographyProps)[]
} & TypographyBase

export type TypographyBase = {
  noWrap?: boolean // If true, the text will not wrap, but instead will truncate with a text overflow ellipsis.
  // Note that text overflow can only happen with block or inline-block level elements
  // (the element needs to have a width in order to overflow).
  level?: TypographyLevelT
  color?: ColorT
  gutterBottom?: boolean // if true, the text will have a bottom margin.
  variant?: VariantT
  startDecorator?: DecoratorT
  endDecorator?: DecoratorT
  textColor?: any
  textAlign?: AlignTextT
  fontSize?: SizeT | string
  fontWeight?: SizeT | string
}

export type TextT = string | TypographyProps
