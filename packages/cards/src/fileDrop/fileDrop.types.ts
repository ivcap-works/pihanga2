import {
  createCardDeclaration,
  createOnAction,
  registerActions,
} from "@pihanga2/core"

export const FILE_DROP_CARD = "file-drop"
export const FileDrop = createCardDeclaration<FileDropProps, FileDropEvents>(
  FILE_DROP_CARD,
)

export const FILE_DROP_ACTION = registerActions(FILE_DROP_CARD, ["clicked"])

export const onFileDropClicked = createOnAction<CloseEvent>(
  FILE_DROP_ACTION.CLICKED,
)

export type FileDropProps<S = any> = {
  fileTypes?: string[]
  title?: string
  description?: string
  showProgress?: boolean
  progressStyle?: { [k: string]: any }
  progress?: number

  style?: S
  className?: string
}

export const DEF_FILE_DROP_FILE_TYPES = ["JPG", "PNG", "GIF"]

export type FileDroppedEvent = {
  file: File
}

export type FileDropEvents = {
  onFileDropped: FileDroppedEvent
}
