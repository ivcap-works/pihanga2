//import type { PluggableList } from "react-markdown/lib/react-markdown"
import { createCardDeclaration } from "@pihanga2/core"
import { CSSModuleClasses } from "@pihanga2/core/dist/types"
// @ts-ignore
import type { PluggableList } from "react-markdown/lib"

export const MARKDOWN_CARD = "markdown-viewer"
export const MarkdownViewer =
  createCardDeclaration<MarkdownViewerProps>(MARKDOWN_CARD)

export type MarkdownViewerProps<S = any> = {
  source?: string
  path?: string // path to file containing markdown text
  maxBodyLength?: number // negative number won't shorten the text

  remarkPlugins?: PluggableList
  rehypePlugins?: PluggableList
  remarkRehypeOptions?: Object

  className?: CSSModuleClasses // to be added to outer div
  style?: S
}
