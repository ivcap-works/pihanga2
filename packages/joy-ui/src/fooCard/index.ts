import {
  PiRegister,
  createCardDeclaration,
  actionTypesToEvents,
} from "@pihanga2/core"

import { FooComponent } from "./foo.component"
import {
  type FooProps,
  type ComponentEvents,
  FOO_ACTION,
  FOO_CARD,
} from "./foo.types"

export * from "./foo.types"
export type { FooSX } from "./foo.sx"

const JY_FOO_CARD = "joy/" + FOO_CARD
export const JyFoo = createCardDeclaration<FooProps, ComponentEvents>(
  JY_FOO_CARD,
)

export function fooInit(register: PiRegister): void {
  register.cardComponent({
    name: JY_FOO_CARD,
    component: FooComponent,
    events: actionTypesToEvents(FOO_ACTION),
  })
}
