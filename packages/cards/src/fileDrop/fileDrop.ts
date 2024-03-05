import {
  createCardDeclaration,
  createOnAction,
  registerActions,
} from "@pihanga2/core"

export const FILE_DROP_TYPE = "file-drop"
export const FileDrop = createCardDeclaration<FileDropProps, FileDropEvents>(
  FILE_DROP_TYPE,
)

export const FILE_DROP_ACTION = registerActions(FILE_DROP_TYPE, ["clicked"])

export const onFileDropClicked = createOnAction<CloseEvent>(
  FILE_DROP_ACTION.CLICKED,
)

export type FileDropProps = {
  fileTypes?: string[];
  title?: string;
  description?: string;
  showProgress?: boolean;
  progressStyle?: { [k: string]: any };
  progress?: number;
}

export const DEF_FILE_DROP_FILE_TYPES = ["JPG", "PNG", "GIF"]

export type FileDroppedEvent = {
  file: File;
};

export type FileDropEvents = {
  onFileDropped: FileDroppedEvent
}
