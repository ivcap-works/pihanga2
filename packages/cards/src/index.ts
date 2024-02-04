import { PiRegister } from "@pihanga/core"

// Import all local components
import { imageViewerInit } from "./imageViewer"
import { jsonViewerInit } from "./jsonViewer"
import { markdownViewerInit } from "./markdownViewer"
import { fileDropInit } from "./fileDrop"
import { flexGridInit } from "./flexGrid"
import { googleMapInit } from "./googleMap"

export * from "./imageViewer"
export * from "./jsonViewer"
export * from "./markdownViewer"
export * from "./types/common"
export * from "./accordion"
export * from "./fileDrop"
export * from "./flexGrid"

export function init(register: PiRegister): void {
  imageViewerInit(register)
  jsonViewerInit(register)
  markdownViewerInit(register)
  fileDropInit(register)
  flexGridInit(register)
  googleMapInit(register)
}
