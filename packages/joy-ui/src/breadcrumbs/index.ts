import {
  PiRegister,
  createCardDeclaration,
  actionTypesToEvents,
} from "@pihanga2/core"

import { Component } from "./breadcrumbs.component"
import { BREADCRUMB_ACTION, BREADCRUMB_TYPE } from "@pihanga2/cards"
import type { BreadcrumbsProps, BreadcrumbEvents } from "@pihanga2/cards"

export const JY_BREADCRUMB_TYPE = "joy/" + BREADCRUMB_TYPE
export const JyBreadcrumbs = createCardDeclaration<
  BreadcrumbsProps,
  BreadcrumbEvents
>(JY_BREADCRUMB_TYPE)

export function init(register: PiRegister): void {
  register.cardComponent({
    name: JY_BREADCRUMB_TYPE,
    component: Component,
    events: actionTypesToEvents(BREADCRUMB_ACTION),
  })
}
