import {
  PiRegister,
  registerActions,
  actionTypesToEvents,
  createOnAction,
  createCardDeclaration,
} from "@pihanga/core"

import { Component } from "./page.component"
import type {
  ComponentProps,
  LogoutEvent,
  ComponentEvents,
} from "./page.component"

const CARD_TYPE = "tb/page"

export const TbPage = createCardDeclaration<ComponentProps, ComponentEvents>(
  CARD_TYPE,
)

export const ACTION_TYPES = registerActions(CARD_TYPE, ["logout"])
export const onLogout = createOnAction<LogoutEvent>(ACTION_TYPES.LOGOUT)

export function init(register: PiRegister): void {
  register.cardComponent({
    name: CARD_TYPE,
    component: Component,
    events: actionTypesToEvents(ACTION_TYPES),
  })
}
