import { SxProps } from "@mui/material"
import { PiCardRef } from "@pihanga2/core"

export type ComponentProps = {
  pageTitle: string
  contentCard: PiCardRef
  headerCard: PiCardRef
  sidebarCard: PiCardRef
  breadcrumbsCard: PiCardRef
  actionCard?: PiCardRef
  modalCard?: PiCardRef
  joy?: {
    sx?: {
      root?: SxProps
    }
  }
}

export const DEF_ROOT_SX: SxProps = { display: "flex", minHeight: "100dvh" }

// export type SomeEvent = {
//   something: string
// }

// export type ComponentEvents = {
//   onSomething: SomeEvent
// }
