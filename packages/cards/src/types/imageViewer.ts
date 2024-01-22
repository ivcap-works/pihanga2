import {
  createCardDeclaration,
  createOnAction,
  registerActions,
} from "@pihanga/core"

export const IMAGE_TYPE = "image-viewer"
export const ImageViewer = createCardDeclaration<
  ImageViewerProps,
  ComponentEvents
>(IMAGE_TYPE)

export const ACTION_TYPES = registerActions(IMAGE_TYPE, ["clicked"])

export const onImageViewerClicked = createOnAction<CloseEvent>(
  ACTION_TYPES.CLICKED,
)

export type ImageViewerProps = {
  imgURL: string
  caption: string
  width?: number
  height?: number
}

export type ClickedEvent = {}

export type ComponentEvents = {
  onClicked: ClickedEvent
}
