import { PiCardRef, createCardDeclaration } from "@pihanga2/core"
import {
  AlignItemsT,
  AlignTextT,
  ColorT,
  DisplayGridT,
  OrientationT,
  SizeT,
  VariantT,
} from "./common"

export const CARD_CARD = "card"
export const Card = createCardDeclaration<CardProps>(CARD_CARD)

export type CardProps<S = any> = {
  content: CardContentT[]
  actions?: CardActionsT

  color?: ColorT
  invertedColors?: boolean // If true, the children with an implicit color prop
  // invert their colors to match the component's variant and color.

  orientation?: OrientationT
  size?: SizeT
  variant?: VariantT
  shadowSize?: SizeT
  flexDirection?: DisplayGridT

  component?: React.ElementType<any>
  className?: string
  style?: S
}

export type CardContentT = {
  content: PiCardRef
  hidePadding?: boolean
  alignItems?: AlignItemsT
  textAlign?: AlignTextT
  component?: React.ElementType<any>
  orientation?: OrientationT // component orientation
}

export type CardActionsT = {
  content: PiCardRef[]
  buttonFlex: number
  hidePadding?: boolean
  orientation?: OrientationT
  component?: React.ElementType<any>
}
