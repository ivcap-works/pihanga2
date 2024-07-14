import { PiCardRef, createCardDeclaration } from "@pihanga2/core"
import { AlignItemsT, DisplayGridT } from "./common"

export const BOX_CARD = "box"
export const Card = createCardDeclaration<BoxProps>(BOX_CARD)

export type BoxProps<S = any> = {
  content?: PiCardRef[]
  component?: React.ElementType<any>
  height?: number
  width?: number

  marginTop?: number
  marginBottom?: number
  marginLeft?: number
  marginRight?: number

  paddingTop?: number
  paddingBottom?: number
  paddingLeft?: number
  paddingRight?: number

  alignItems?: AlignItemsT
  gap?: number
  padding?: number
  display?: DisplayGridT

  style?: S
  className?: string
}
