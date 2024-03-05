import { PiRegister, actionTypesToEvents } from "@pihanga2/core"

import { ImageViewerComponent } from "./imageViewer.component"
import { IMAGE_VIEWER_ACTION, IMAGE_VIEWER_TYPE } from "./imageViewer"

export * from "./imageViewer"

export function imageViewerInit(register: PiRegister): void {
  register.cardComponent({
    name: IMAGE_VIEWER_TYPE,
    component: ImageViewerComponent,
    events: actionTypesToEvents(IMAGE_VIEWER_ACTION),
  })
}
