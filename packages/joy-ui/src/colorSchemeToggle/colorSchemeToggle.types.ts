import { IconId } from "@pihanga2/cards/src/icons"
import {
  createCardDeclaration,
  createOnAction,
  registerActions,
} from "@pihanga2/core"

export const CARD_TYPE = "colorSchemeToggle"
export const ColoreSchemeToggle = createCardDeclaration<ColorSchemeToggleProps, ComponentEvents>(CARD_TYPE)

export const ACTION_TYPES = registerActions(CARD_TYPE, ["mode"])

export const onColorMode = createOnAction<ColorModeEvent>(ACTION_TYPES.MODE)

export type ColorSchemeToggleProps = {
  lightIcon?: IconId
  darkIcon?: IconId
}

export type ColorModeEvent = {
  mode: "light" | "dark"
}

export type ComponentEvents = {
  onMode: ColorModeEvent
}
