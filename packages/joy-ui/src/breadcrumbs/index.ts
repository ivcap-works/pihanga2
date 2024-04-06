import {
  PiRegister,
  createCardDeclaration,
  actionTypesToEvents,
} from "@pihanga2/core"

import { Component } from "./breadcrumbs.component"
import { BREADCRUMB_ACTION } from "@pihanga2/cards/src/breadcrumbs"
import type {
  BreadcrumbsProps,
  BreadcrumbEvents,
} from "@pihanga2/cards/src/breadcrumbs"

export const BREADCRUMB_TYPE = "joy/breadcrumbs"
export const JyBreadcrumbs = createCardDeclaration<
  BreadcrumbsProps,
  BreadcrumbEvents
>(BREADCRUMB_TYPE)

export function init(register: PiRegister): void {
  register.cardComponent({
    name: BREADCRUMB_TYPE,
    component: Component,
    events: actionTypesToEvents(BREADCRUMB_ACTION),
  })
}
