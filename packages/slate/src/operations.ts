import {
  createOnAction,
  DispatchF,
  ReduxAction,
  ReduxState,
  registerActions,
} from "@pihanga2/core"
import { Editor, Path, Text, Transforms, Location, BaseRange, Point } from "slate"
import { registerOP } from "./slate.component"
import { NodeT, onElementSelected } from "./slate.types"
import { ReactEditor } from "slate-react"

export const SLATE_OP_ACTION = registerActions("slate/op", [
  // editor itself is listening for that
  "show_content",
  "transform",
])

export enum OperationE {
  ScrollIntoView = "scroll_into_view",
}

export type ShowContentEvent = {
  cardName: string
  content: NodeT[]
}

export const dispatchShowContent = (d: DispatchF, ev: ShowContentEvent) => {
  d({ ...ev, type: SLATE_OP_ACTION.SHOW_CONTENT })
}

export const onShowContent = createOnAction<ShowContentEvent>(
  SLATE_OP_ACTION.SHOW_CONTENT,
)

export type TransformEvent = {
  opID: string
  editorID?: string
}

export const dispatchTransform = <T extends TransformEvent>(
  d: DispatchF,
  ev: T,
) => {
  d({ ...ev, type: SLATE_OP_ACTION.TRANSFORM })
}

export const onTransform = createOnAction<TransformEvent>(
  SLATE_OP_ACTION.TRANSFORM,
)

export function registerLeafMarker<
  L,
  A extends ReduxAction,
  S extends ReduxState,
>(
  opID: string,
  leafType: string,
  props: any,
  matchF: (leaf: L, editorID: string, action: A, state: S) => boolean,
) {
  const f = (
    editorID: string,
    editor: Editor,
    action: ReduxAction,
    state: ReduxState,
  ) => {
    const match: any = (node: Node, _: Path) => {
      if (!Text.isText(node)) {
        return false // marks can only be applied to text
      }
      const n: any = node
      if (n.type !== leafType) return false
      const f = matchF(n, editorID, action as any, state as any)
      return f
    }
    Transforms.setNodes<any>(editor, props, {
      at: editor.range([]),
      match,
      split: false,
      voids: true,
    })
  }
  registerOP(opID, f)
}

// SET SELECTION

export type ScrollIntoViewEvent = {
  editorID: string
  location: Path | Point
}

export const dispatchScrollIntoView = (
  d: DispatchF,
  ev: ScrollIntoViewEvent,
) => {
  d({ ...ev, type: SLATE_OP_ACTION.TRANSFORM, opID: OperationE.ScrollIntoView })
}

export function op_init() {

  registerOP<ScrollIntoViewEvent & ReduxAction, ReduxState>(
    OperationE.ScrollIntoView,
    (editorID, editor, action) => {
      if (!action.editorID || editorID === action.editorID) {
        let range: BaseRange
        const l = action.location
        if (Path.isPath(l)) {
          const p: Point = { path: l, offset: 0 }
          range = { anchor: p, focus: p }
        } else if (Point.isPoint(l)) {
          range = { anchor: l, focus: l }
        } else {
          console.log("scrollIntoView: expected Path | Point", l)
          return
        }
        const domRange = ReactEditor.toDOMRange(editor, range)
        if (domRange) {
          const el = domRange.startContainer?.parentElement
          if (el) {
            // console.log(">>>", el)
            el.scrollIntoView({
              behavior: "smooth", // Options: 'auto', 'smooth'
              block: "start", // Options: 'start', 'center', 'end', 'nearest'
            })
          }
        }
      }
    },
  )
}
