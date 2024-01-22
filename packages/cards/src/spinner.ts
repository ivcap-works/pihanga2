import { ColorT, VariantT } from "@pihanga/cards/dist/types"
import { PiCardRef, createCardDeclaration } from "@pihanga/core"

export const SPINNER_TYPE = "spinner"
export const Spinner = createCardDeclaration<SpinnerProps>(SPINNER_TYPE)

export const DEF_SPINNER_HEIGHT = 200

export type SpinnerProps = {
  height?: number
  value?: number // 0...100 .. if not set, run freely
  // optional child card to display inside the spinner
  childCard?: PiCardRef
  thickness?: number
  color?: ColorT
  variant?: VariantT
}
