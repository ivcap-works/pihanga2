import {
  createCardDeclaration,
  createOnAction,
  registerActions,
} from "@pihanga2/core"
import { ThemeKeys } from "react-json-view"

export const JSON_VIEWER_CARD = "json-viewer"
export const JsonViewer = createCardDeclaration<
  JsonViewerProps,
  JsonViewerEvents
>(JSON_VIEWER_CARD)

export const JSON_VIEWER_ACTION = registerActions(JSON_VIEWER_CARD, ["clicked"])

export const onJsonViewerClicked = createOnAction<CloseEvent>(
  JSON_VIEWER_ACTION.CLICKED,
)

export type JsonViewerProps<S = any> = {
  source: any
  theme?: ThemeKeys
  iconStyle?: "circle" | "triangle" | "square"
  // When set to true, all nodes will be collapsed by default.
  // Use an integer value to collapse at a particular depth.
  collapsed?: boolean | number
  // When set the user can copy objects and arrays to clipboard by clicking on the clipboard icon
  enableClipboard?: boolean
  // When set removes quotes from keys (eg. "name": vs. name:)
  removeQuotesOnKeys?: boolean
  // When set to true, objects and arrays are labeled with size
  displayObjectSize?: boolean
  // When set to true, data type labels prefix values
  displayDataTypes?: boolean
  // When set, called before json is rendered to the browser
  modifyFn?: ModifyFn

  // Style attributes for react-json-view container
  style?: S
  className?: string
}

export type ModifyFn = (source: any, el: HTMLElement | null) => void

export type ClickedEvent = {}

export type JsonViewerEvents = {
  onClicked: ClickedEvent
}
