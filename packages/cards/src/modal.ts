import {
  PiCardRef,
  createCardDeclaration,
  createOnAction,
  registerActions,
} from "@pihanga2/core"

export const MODAL_TYPE = "modal"
export const Modal = createCardDeclaration<ModalProps, ModalEvents>(MODAL_TYPE)

export const MODAL_ACTION = registerActions(MODAL_TYPE, ["open", "close"])

export const onModalOpen = createOnAction<CloseEvent>(MODAL_ACTION.OPEN)
export const onModalClose = createOnAction<CloseEvent>(MODAL_ACTION.CLOSE)

export const MODAL_MAX_WIDTH_DEF = 500
export const MODAL_MIN_WIDTH_DEF = 300

export type ModalProps = {
  title?: string
  open: boolean
  contentCard: PiCardRef
  footerCard?: PiCardRef
  maxWidth?: number
  minWidth?: number
}

export type OpenEvent = {}
export type CloseEvent = {}

export type ModalEvents = {
  onOpen: OpenEvent
  onClose: CloseEvent
}
