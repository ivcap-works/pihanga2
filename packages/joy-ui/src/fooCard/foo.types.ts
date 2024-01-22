import { SxProps } from "@mui/material"
import {
  PiCardRef,
  createCardDeclaration,
  createOnAction,
  registerActions,
} from "@pihanga/core"

export const CARD_TYPE = "foo"
export const Foo = createCardDeclaration<FooProps, ComponentEvents>(CARD_TYPE)

export const ACTION_TYPES = registerActions(CARD_TYPE, ["something"])

export const onXXX = createOnAction<SomeEvent>(ACTION_TYPES.SOMETHING)

export type FooProps = {
  contentCard: PiCardRef
  joy?: {
    sx?: {
      root?: SxProps
    }
  }
}

export const DEF_SX: { [k: string]: SxProps } = {
  root: {},
}

export type SomeEvent = {
  something: string
}

export type ComponentEvents = {
  onSomething: SomeEvent
}
