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
export * from "./box"
export * from "./typography"
export * from "./card"
export * from "./link"
export * from "./form"
export * from "./button"
export * from "./buttonGroup"
export * from "./formInput"
export * from "./pageD1"
export * from "./pageD2"
export * from "./modal"
export * from "./list"
export * from "./accordion"
export * from "./breadcrumbs"
export * from "./dataGrid"
export * from "./spinner"
export * from "./table"
export * from "./chat"
export * from "./input"
export * from "./chip"
export * from "./tabs"
export * from "./select"
export * from "./clickAwayListener"
export * from "./badge"

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
