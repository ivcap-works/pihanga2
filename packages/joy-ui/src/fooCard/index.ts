import {
  PiRegister,
  createCardDeclaration,
  actionTypesToEvents,
} from "@pihanga/core"

import { FooComponent } from "./foo.component"
import { type FooProps, type ComponentEvents, ACTION_TYPES } from "./foo.types"

export const CARD_TYPE = "joy/foo"
export const JyFoo = createCardDeclaration<FooProps, ComponentEvents>(CARD_TYPE)

export function init(register: PiRegister): void {
  register.cardComponent({
    name: CARD_TYPE,
    component: FooComponent,
    events: actionTypesToEvents(ACTION_TYPES),
  })
}
