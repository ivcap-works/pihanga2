import {
  registerActions,
  PiRegister,
  createCardDeclaration,
  createOnAction,
  actionTypesToEvents,
} from "@pihanga/core"

import { Component } from "./actionBar.component"
import type {
  ComponentProps,
  ComponentEvents,
  SelectEvent,
} from "./actionBar.component"

export const CARD_TYPE = "tb/actionBar"
export const TbActionBar = createCardDeclaration<
  ComponentProps,
  ComponentEvents
>(CARD_TYPE)

export const ACTION_TYPES = registerActions(CARD_TYPE, ["select"])

export const onSelect = createOnAction<SelectEvent>(ACTION_TYPES.SELECT)

export function init(register: PiRegister): void {
  register.cardComponent({
    name: CARD_TYPE,
    component: Component,
    events: actionTypesToEvents(ACTION_TYPES),
  })
}
