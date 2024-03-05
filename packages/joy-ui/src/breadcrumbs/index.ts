import {
  registerActions,
  PiRegister,
  createCardDeclaration,
  createOnAction,
  actionTypesToEvents,
} from "@pihanga2/core"

import { Component } from "./breadcrumbs.component"
import type { BreadcrumbsProps, SomeEvent } from "@pihanga2/cards/src/breadcrumbs"

export const CARD_TYPE = "joy/breadcrumbs"
export const JyBreadcrumbs = createCardDeclaration<BreadcrumbsProps>(CARD_TYPE)

export const ACTION_TYPES = registerActions(CARD_TYPE, ["link_clicked"])

export const onLinkClicked = createOnAction<SomeEvent>(
  ACTION_TYPES.LINK_CLICKED,
)

export function init(register: PiRegister): void {
  register.cardComponent({
    name: CARD_TYPE,
    component: Component,
    events: actionTypesToEvents(ACTION_TYPES),
  })
}
