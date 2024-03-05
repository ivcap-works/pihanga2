import { PiRegister } from "@pihanga2/core"

import { MarkdownViewerComponent } from "./markdownViewer.component"
import { MARKDOWN_TYPE } from "./markdownViewer"

export * from "./markdownViewer"

export function markdownViewerInit(register: PiRegister): void {
  register.cardComponent({
    name: MARKDOWN_TYPE,
    component: MarkdownViewerComponent,
  })
}
