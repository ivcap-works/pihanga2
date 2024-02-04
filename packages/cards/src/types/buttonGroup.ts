import { PiCardRef, createCardDeclaration } from "@pihanga/core"
import { ColorT, SizeT, VariantT } from "./common"

const CARD_TYPE = "button-group"
export const ButtonGroup = createCardDeclaration<ButtonGroupProps>(CARD_TYPE)

export type ButtonGroupProps = {
  buttons: PiCardRef[]
  ariaLabel: string
  isDisabled?: boolean
  color?: ColorT
  size?: SizeT
  variant?: VariantT
  //   The type of 'spacing' can be:
  //
  // string: any valid CSS length unit, e.g. px, rem, em, etc.
  // number: will be calculated by theme.spacing function.
  // array: the responsive values based on the breakpoints defined in the theme.
  // object: the key must be one of the breakpoints defined in the theme (the defaults are "xs" | "sm" | "md" | "lg" | "xl"), and the value is the spacing of type string or number.
  spacing?: SpacingT // default: 0
  orientation?: "horizontal" | "vertical"
  buttonFlex?: number | string // The flex value of the button.
}

// eslint-disable-next-line prettier/prettier
type SpacingT =
  | Array<number | string>
  | number
  | {
    lg?: number | string
    md?: number | string
    sm?: number | string
    xl?: number | string
    xs?: number | string
  }
  | string
