import { SvgIconTypeMap } from "@mui/material"
import { OverridableComponent } from "@mui/material/OverridableComponent"
import { registerIcon, type IconId } from "@pihanga/cards/dist/icons"

export type SvgIconT = OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
  muiName: string
}

export function registerMuiIcon(el: SvgIconT): IconId {
  return registerIcon(el)
}
