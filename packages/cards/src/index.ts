import { PiRegister } from "@pihanga/core"

// Import all local components
import { init as imageViewerInit } from "./imageViewer"

export function init(register: PiRegister): void {
  imageViewerInit(register)
}
