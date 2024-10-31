import { SxProps } from "@mui/material"
import {
  PiCardRef,
  createCardDeclaration,
  createOnAction,
  registerActions,
} from "@pihanga2/core"

export const FOO_CARD = "foo"
export const Foo = createCardDeclaration<FooProps, ComponentEvents>(FOO_CARD)

export const FOO_ACTION = registerActions(FOO_CARD, ["something"])

export const onXXX = createOnAction<FooSomeEvent>(FOO_ACTION.SOMETHING)

export type FooProps<S = any, T = any> = {
  contentCard: PiCardRef
  className?: string
  style?: S
  theme?: T
}

export type FooSomeEvent = {
  something: string
}

export type ComponentEvents = {
  onSomething: FooSomeEvent
}
