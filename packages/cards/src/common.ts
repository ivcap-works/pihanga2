import { PiCardRef } from "@pihanga2/core"
import { IconId } from "./icons"

export type ColorT =
  | "danger"
  | "neutral"
  | "primary"
  | "secondary"
  | "success"
  | "warning"

export type SizeT = "lg" | "md" | "sm" | "icon"

export type VariantT = "outlined" | "plain" | "soft" | "solid" | "ghost"

export type TypographyLevelT =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "title-lg"
  | "title-md"
  | "title-sm"
  | "body-md"
  | "body-sm"
  | "body-xs"

export type DecoratorT =
  | IconDecoratorT
  | AvatarDecoratorT
  | ChipDecoratorT
  | CardDecoratorT

export type IconDecoratorT = {
  type: DecoratorE.Icon
  icon: IconId
  fontSize?: SizeT
  color?: ColorT
  className?: string
}

export type AvatarDecoratorT = {
  type: DecoratorE.Avatar
  src: string
  fallback?: string // text if loading 'src' fails
  size: SizeT
  className?: string
}

export type ChipDecoratorT = {
  type: DecoratorE.Chip
  text: string
  className?: string
}

export type CardDecoratorT = {
  type: DecoratorE.Card
  cardName: PiCardRef
}

export enum DecoratorE {
  Icon = "icon",
  Avatar = "avatar",
  Chip = "chip",
  Card = "card",
}

// Defines the flex-direction style property. It is applied for all screen sizes.
export type DirectionT = "column-reverse" | "column" | "row-reverse" | "row"

// | Array<"column-reverse" | "column" | "row-reverse" | "row">

export type JustifyContentT =
  | "flex-start"
  | "center"
  | "flex-end"
  | "space-between"
  | "space-around"
  | "space-evenly"

export type AlignItemsT =
  | "normal" // Default. Behaves like 'stretch' for flexbox and grid items, or 'start' for grid items with a defined block size.
  | "stretch" // Items are stretched to fit the container
  | "center" // Items are positioned at the center of the container
  | "flex-start" // Items are positioned at the beginning of the container
  | "flex-end" // Items are positioned at the end of the container
  | "start" // Items are positioned at the beginning of their individual grid cells, in the block direction
  | "end" // Items are positioned at the end of the their individual grid cells, in the block direction
  | "baseline" // Items are positioned at the baseline of the container
  | "initial" // Sets this property to its default value. Read about initial
  | "inherit" // Inherits this property from its parent element. Read about inherit

export type AlignTextT =
  | "left" // Aligns the text to the left
  | "right" // Aligns the text to the right
  | "center" // Centers the text
  | "justify" // Stretches the lines so that each line has equal width (like in newspapers and magazines)
  | "initial" // Sets this property to its default value. Read about initial
  | "inherit" // Inherits this property from its parent element. Read about inherit

export type DisplayGridT = {
  xs?: string // <576px
  sm?: string // ≥576px
  md?: string // ≥768px
  lg?: string // ≥992px
  xl?: string // ≥1200px
  xxl?: string // ≥1400px
}

export type OrientationT = "horizontal" | "vertical" | "horizontal-reverse"
