import { ColorT, VariantT } from "./common"
import { createCardDeclaration } from "@pihanga2/core"

export const BADGE_CARD = "badge"
export const Badge = createCardDeclaration<BadgeProps>(BADGE_CARD)

export type BadgeProps<S = any> = {
  label: string
  variant?: VariantT
  color?: ColorT

  style?: S
  className?: string
}
