import { PiRegister, actionTypesToEvents } from "@pihanga/core"

import { ImageViewerComponent } from "./imageViewer.component"
import { ACTION_TYPES } from "../types/imageViewer"
import { IMAGE_TYPE } from "../types/imageViewer"

export function init(register: PiRegister): void {
  register.cardComponent({
    name: IMAGE_TYPE,
    component: ImageViewerComponent,
    events: actionTypesToEvents(ACTION_TYPES),
  })
}
