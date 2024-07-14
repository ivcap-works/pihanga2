import {
  createCardDeclaration,
  createOnAction,
  registerActions,
} from "@pihanga2/core"

export const IMAGE_VIEWER_TYPE = "image-viewer"
export const ImageViewer = createCardDeclaration<
  ImageViewerProps,
  ImageViewerEvents
>(IMAGE_VIEWER_TYPE)

export const IMAGE_VIEWER_ACTION = registerActions(IMAGE_VIEWER_TYPE, [
  "clicked",
])

export const onImageViewerClicked = createOnAction<CloseEvent>(
  IMAGE_VIEWER_ACTION.CLICKED,
)

export type ImageViewerProps = {
  imgURL: string
  caption: string
  width?: number
  minWidth?: number | string
  maxWidth?: number | string
  height?: number
  style?: React.CSSProperties
}

export type ImageViewerClickedEvent = {}

export type ImageViewerEvents = {
  onClicked: ImageViewerClickedEvent
}
