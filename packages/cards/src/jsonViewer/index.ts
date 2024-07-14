import { PiRegister, actionTypesToEvents } from "@pihanga2/core"

import { JSON_VIEWER_CARD, JSON_VIEWER_ACTION } from "./jsonViewer.types"
import { ImageViewerComponent } from "./jsonViewer.component"

export * from "./jsonViewer.types"

export function jsonViewerInit(register: PiRegister): void {
  register.cardComponent({
    name: JSON_VIEWER_CARD,
    component: ImageViewerComponent,
    events: actionTypesToEvents(JSON_VIEWER_ACTION),
  })
}
