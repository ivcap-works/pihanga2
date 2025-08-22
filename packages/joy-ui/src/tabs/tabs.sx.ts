import { SxProps } from "@mui/joy/styles/types"

export type TabsSX = {
  root?: SxProps
  list?: SxProps
  tab?: SxProps
  panel?: SxProps
}

export const DEF_SX: TabsSX = {
  root: {},
  list: {},
  tab: {},
  panel: {},
}
