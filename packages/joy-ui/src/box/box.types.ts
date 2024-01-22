import { SxProps } from "@mui/material"
import { PiCardRef } from "@pihanga/core"

export type ComponentProps = {
  content: PiCardRef
  component?: React.ElementType<any>
  className?: string
  joy?: {
    sx?: {
      root?: SxProps
    }
  }
}

export const DEF_ROOT_SX: SxProps = {}

export type SomeEvent = {
  something: string
}

export type ComponentEvents = {
  onSomething: SomeEvent
}
