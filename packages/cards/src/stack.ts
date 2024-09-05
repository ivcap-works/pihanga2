import { PiCardRef, createCardDeclaration } from "@pihanga2/core"
import { AlignItemsT, DirectionT, JustifyContentT } from "./common"

export const STACK_CARD = "stack"
export const Stack = createCardDeclaration<StackProps>(STACK_CARD)

export type StackProps<S = any> = {
  content: PiCardRef[]

  direction?: DirectionT
  divider?: PiCardRef
  spacing?: number
  justifyContent?: JustifyContentT
  alignItems?: AlignItemsT

  className?: string
  style?: S
}
