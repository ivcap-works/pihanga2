import { PiCardRef } from "@pihanga2/core"
import { Theme } from "@mui/joy/styles"

export type WindowProps = {
  content: PiCardRef[]
  defaultMode?: "light" | "dark" | "system" //  Application's default mode (light by default)
  disableTransitionOnChange?: boolean // Disable CSS transitions when switching between modes
  theme?: Theme // the theme provided to React's context
}
