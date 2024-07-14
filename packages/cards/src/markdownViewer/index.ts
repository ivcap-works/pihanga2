import { PiRegister } from "@pihanga2/core"

import { MarkdownViewerComponent } from "./markdownViewer.component"
import { MARKDOWN_CARD } from "./markdownViewer.types"

export * from "./markdownViewer.types"

export function markdownViewerInit(register: PiRegister): void {
  register.cardComponent({
    name: MARKDOWN_CARD,
    component: MarkdownViewerComponent,
  })
}
