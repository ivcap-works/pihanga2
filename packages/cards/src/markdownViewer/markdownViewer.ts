import type { PluggableList } from "react-markdown/lib/react-markdown"
import { createCardDeclaration } from "@pihanga2/core"
import { CSSModuleClasses } from "@pihanga2/core/dist/types"

export const MARKDOWN_TYPE = "markdown-viewer"
export const MarkdownViewer =
  createCardDeclaration<MarkdownViewerProps>(MARKDOWN_TYPE)

export type MarkdownViewerProps = {
  source?: string
  path?: string // path to file containing markdown text
  maxBodyLength?: number // negative number won't shorten the text

  remarkPlugins?: PluggableList
  rehypePlugins?: PluggableList
  remarkRehypeOptions?: Object

  extraClassName?: CSSModuleClasses // to be added to outer div
  extraStyle?: Object
}
