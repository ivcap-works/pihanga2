import {
  createCardDeclaration,
  createOnAction,
  registerActions,
} from "@pihanga2/core"
import { ThemeKeys } from "react-json-view"

export const JSON_TYPE = "json-viewer"
export const JsonViewer = createCardDeclaration<
  JsonViewerProps,
  JsonViewerEvents
>(JSON_TYPE)

export const JSON_VIEWER_ACTION = registerActions(JSON_TYPE, ["clicked"])

export const onJsonViewerClicked = createOnAction<CloseEvent>(
  JSON_VIEWER_ACTION.CLICKED,
)

export type JsonViewerProps = {
  source: any
  theme?: ThemeKeys
  iconStyle?: "circle" | "triangle" | "square"
  // When set to true, objects and arrays are labeled with size
  displayObjectSize?: boolean
  // When set to true, data type labels prefix values
  displayDataTypes?: boolean
  // When set, called before json is rendered to the browser
  modifyFn?: ModifyFn
}

export type ModifyFn = (source: any, el: HTMLElement | null) => void

export type ClickedEvent = {}

export type JsonViewerEvents = {
  onClicked: ClickedEvent
}
