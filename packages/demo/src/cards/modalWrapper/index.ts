import {
  DispatchF,
  PiRegister,
  ReduxAction,
  actionTypesToEvents,
  createCardDeclaration,
  createOnAction,
  registerActions,
} from "@pihanga/core"

import { Component } from "./modal.component"
import type { ComponentProps, CloseEvent } from "./modal.component"

export const CARD_TYPE = "pi/modalWrapper"
export const PiModalWrapper = createCardDeclaration<ComponentProps>(CARD_TYPE)

export const ACTION_TYPES = registerActions(CARD_TYPE, ["close_request"])

export type ModalState = {
  modalCard?: string
  contentLabel?: string
}

export const onModalCloseRequest = createOnAction<CloseEvent>(
  ACTION_TYPES.CLOSE_REQUEST,
)

export function closeModal(dispatch: DispatchF) {
  dispatch({
    type: ACTION_TYPES.CLOSE_REQUEST,
  } as ReduxAction & CloseEvent)
}

export function init(register: PiRegister): void {
  register.cardComponent({
    name: CARD_TYPE,
    component: Component,
    events: actionTypesToEvents(ACTION_TYPES),
  })
}
