import { PiRegister } from "@pihanga2/core"

// Import all local components
import { imageViewerInit } from "./imageViewer"
import { jsonViewerInit } from "./jsonViewer"
import { markdownViewerInit } from "./markdownViewer"
import { fileDropInit } from "./fileDrop"
import { flexGridInit } from "./flexGrid"
import { googleMapInit } from "./googleMap"
import { routerInit } from "./router"

export * from "./imageViewer"
export * from "./jsonViewer"
export * from "./markdownViewer"
export * from "./common"
export * from "./accordion"
export * from "./fileDrop"
export * from "./flexGrid"
export * from "./icons"

export function init(register: PiRegister): void {
  imageViewerInit(register)
  jsonViewerInit(register)
  markdownViewerInit(register)
  fileDropInit(register)
  flexGridInit(register)
  googleMapInit(register)
  routerInit(register)
}
