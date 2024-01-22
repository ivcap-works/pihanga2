import { SxProps } from "@mui/joy/styles/types"
import { IconId } from "../icons"

export type ColorT = "danger" | "neutral" | "primary" | "success" | "warning"

export type SizeT = "lg" | "md" | "sm"

export type VariantT = "outlined" | "plain" | "soft" | "solid"

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

export type IconDecoratorT = { sx?: SxProps } & {
  type: DecoratorE.Icon
  icon: IconId
  fontSize?: SizeT
}

export type AvatarDecoratorT = {
  type: DecoratorE.Avatar
  src: string
  size: SizeT
}

export type ChipDecoratorT = {
  type: DecoratorE.Chip
  text: string
}

export type CardDecoratorT = {
  type: DecoratorE.Card
  cardName: string
}

export enum DecoratorE {
  Icon = "icon",
  Avatar = "avatar",
  Chip = "chip",
  Card = "card",
}
