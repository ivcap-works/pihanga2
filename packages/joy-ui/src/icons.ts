import { SvgIconTypeMap } from "@mui/material"
import { OverridableComponent } from "@mui/material/OverridableComponent"
import { registerIcon, type IconId } from "@pihanga2/cards"

export type SvgIconT = OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
  muiName: string
}

export function registerMuiIcon(el: any, name?: string): IconId {
  return registerIcon(el, name)
}
