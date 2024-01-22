import {
  registerActions,
  PiRegister,
  createCardDeclaration,
  createOnAction,
  actionTypesToEvents,
} from "@pihanga/core"

import { Component } from "./chip.component"
import type { ComponentProps, SelectEvent, DeleteEvent } from "./chip.types"

export const CARD_TYPE = "joy/chip"
export const JyChip = createCardDeclaration<ComponentProps>(CARD_TYPE)

export const ACTION_TYPES = registerActions(CARD_TYPE, ["select", "delete"])

export const onSelect = createOnAction<SelectEvent>(ACTION_TYPES.SELECT)
export const onDelete = createOnAction<DeleteEvent>(ACTION_TYPES.DELETE)

export function init(register: PiRegister): void {
  register.cardComponent({
    name: CARD_TYPE,
    component: Component,
    events: actionTypesToEvents(ACTION_TYPES),
  })
}
