import { PiRegister } from "@pihanga2/core"

// Import all local components
import { imageViewerInit } from "./imageViewer"
import { jsonViewerInit } from "./jsonViewer"
import { markdownViewerInit } from "./markdownViewer"
import { fileDropInit } from "./fileDrop"
import { flexGridInit } from "./flexGrid"
import { googleMapInit } from "./googleMap"
import { routerInit } from "./router"
import { formInit } from "./form"

export * from "./imageViewer"
export * from "./jsonViewer"
export * from "./markdownViewer"
export * from "./common"
export * from "./accordion"
export * from "./fileDrop"
export * from "./flexGrid"
export * from "./icons"
export * from "./stack"
export * from "./typography"
export * from "./card"
export * from "./link"
export * from "./form"
export * from "./button"
export * from "./formInput"

export function init(register: PiRegister): void {
  imageViewerInit(register)
  jsonViewerInit(register)
  markdownViewerInit(register)
  fileDropInit(register)
  flexGridInit(register)
  googleMapInit(register)
  routerInit(register)
  formInit(register)
}
