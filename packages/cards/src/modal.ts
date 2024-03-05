import {
  PiCardRef,
  createCardDeclaration,
  createOnAction,
  registerActions,
} from "@pihanga2/core"

export const MODAL_TYPE = "modal"
export const Modal = createCardDeclaration<ModalProps, ComponentEvents>(
  MODAL_TYPE,
)

export const ACTION_TYPES = registerActions(MODAL_TYPE, ["open", "close"])

export const onModalOpen = createOnAction<CloseEvent>(ACTION_TYPES.OPEN)
export const onModalClose = createOnAction<CloseEvent>(ACTION_TYPES.CLOSE)

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

export type ComponentEvents = {
  onOpen: OpenEvent
  onClose: CloseEvent
}
