import { PiRegister, actionTypesToEvents } from "@pihanga/core"

import { JSON_TYPE, JSON_VIEWER_ACTION } from "./jsonViewer"
import { ImageViewerComponent } from "./jsonViewer.component"

export * from "./jsonViewer"

export function jsonViewerInit(register: PiRegister): void {
  register.cardComponent({
    name: JSON_TYPE,
    component: ImageViewerComponent,
    events: actionTypesToEvents(JSON_VIEWER_ACTION),
  })
}
