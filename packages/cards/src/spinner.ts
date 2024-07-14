import { ColorT, VariantT } from "./common"
import { PiCardRef, createCardDeclaration } from "@pihanga2/core"

export const SPINNER_CARD = "spinner"
export const Spinner = createCardDeclaration<SpinnerProps>(SPINNER_CARD)

export const DEF_SPINNER_HEIGHT = "auto"

export type SpinnerProps<S = any> = {
  height?: string
  value?: number // 0...100 .. if not set, run freely
  // optional child card to display inside the spinner
  childCard?: PiCardRef
  thickness?: number
  color?: ColorT
  variant?: VariantT

  style?: S
  className?: string
}
