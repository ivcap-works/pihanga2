import {
  createCardDeclaration,
  createOnAction,
  registerActions,
} from "@pihanga2/core"

export const FILE_DROP_CARD = "file-drop"
export const FileDrop = createCardDeclaration<FileDropProps, FileDropEvents>(
  FILE_DROP_CARD,
)

export const FILE_DROP_ACTION = registerActions(FILE_DROP_CARD, [
  "clicked",
  "file_dropped",
  "error",
])

export const onFileDropClicked = createOnAction<CloseEvent>(
  FILE_DROP_ACTION.CLICKED,
)

export const onFileDropped = createOnAction<FileDroppedEvent>(
  FILE_DROP_ACTION.FILE_DROPPED,
)

export const onError = createOnAction<FileDropErrorEvent>(
  FILE_DROP_ACTION.ERROR,
)

export type FileDropProps<S = any> = {
  fileTypes?: string[]
  title?: string
  description?: string
  showProgress?: boolean
  dropStyle?: { [k: string]: any }
  progressStyle?: { [k: string]: any }
  progress?: number

  style?: S
  className?: string
}

export const DEF_FILE_DROP_FILE_TYPES = ["JPG", "PNG", "GIF"]

export type FileDroppedEvent = {
  name: string
  size: number
  type: string
}

export type FileDropErrorEvent = {
  error: string
}

export type FileDropEvents = {
  onFileDropped: FileDroppedEvent
  onError: FileDropErrorEvent
}
