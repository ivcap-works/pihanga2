import React, { useRef, useState } from "react"
import { createEditor, Descendant, Editor, Transforms } from "slate"
import { Slate, Editable, withReact, ReactEditor } from "slate-react"

import {
  PiCardProps,
  ReduxAction,
  ReduxState,
  usePiReducer,
} from "@pihanga2/core"
import {
  ComponentEvents,
  NType,
  LType,
  SlateProps,
  ElementT,
  SLATE_ID_ATTRIBUTE,
} from "./slate.types"
import { renderElement, renderLeaf, sanitize } from "./elements"
import { ShowContentEvent, SLATE_OP_ACTION, TransformEvent } from "./operations"

const ops: {
  [k: string]: (
    editorID: string,
    editor: ReactEditor,
    action: ReduxAction,
    state: ReduxState,
  ) => void | undefined
} = {}

export function registerOP<A extends ReduxAction, S extends ReduxState>(
  opID: string,
  opF: (editorID: string, editor: ReactEditor, action: A, state: S) => void,
) {
  ops[opID] = opF as any
}

const DEF_INTIAL_VALUE: ElementT[] = [
  { type: NType.Paragraph, children: [{ type: LType.Text, text: "..." }] },
]

export const SlateComponent = (
  props: PiCardProps<SlateProps, ComponentEvents>,
): React.ReactNode => {
  const {
    initialValue = DEF_INTIAL_VALUE,
    readonly = false,
    onElementClicked,
    onElementEntered,
    onElementLeft,
    style,
    _cls,
    cardName,
  } = props
  const [editor] = useState(() => withReact(createEditor()))
  const currentMouseOver = useRef<[string, Element] | null>(null)

  usePiReducer<ReduxState, ShowContentEvent & ReduxAction>(
    SLATE_OP_ACTION.SHOW_CONTENT,
    (_, a) => {
      if (cardName === a.cardName) {
        const at = editor.range([])
        Transforms.insertNodes(editor, a.content, { at })
      }
    },
  )

  usePiReducer<ReduxState, TransformEvent & ReduxAction>(
    SLATE_OP_ACTION.TRANSFORM,
    (s, a) => {
      if (!a.editorID || cardName === a.editorID) {
        const opF = ops[a.opID]
        if (opF) {
          opF(cardName, editor, a, s)
        }
      }
    },
  )

  const initialV = sanitize(initialValue) as Descendant[]

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (!event.ctrlKey) {
      return
    }

    switch (event.key) {
      // When "`" is pressed, keep our existing code block logic.
      case "`": {
        event.preventDefault()
        // Editor.addMark(editor, "bold", true)

        Object.values(ops).forEach((opF) =>
          opF(cardName, editor, {} as any, {} as any),
        )
        break
      }

      // When "B" is pressed, bold the text in the selection.
      case "b": {
        event.preventDefault()
        Editor.addMark(editor, "bold", true)
        break
      }
    }
  }

  const onMouseOver = (ev: React.MouseEvent<HTMLElement>) => {
    let target = ev.target as Element
    let elementID = getElementID(ev.target as Element)
    // if (!elementID) {
    //   let p = (ev.target as Element).parentElement
    //   let i = 0
    //   while (p && !elementID && i < 5) {
    //     target = p
    //     elementID = getElementID(p)
    //     p = p.parentElement
    //     i += 1
    //   }
    // }
    if (elementID) {
      if (currentMouseOver.current) {
        const currID = currentMouseOver.current[0]
        if (currID === elementID) {
          return
        }
        onElementLeft({ elementID: currentMouseOver.current[0] })
      }
      currentMouseOver.current = [elementID, target]
      onElementEntered({ elementID })
    }
  }

  const onMouseOut = (ev: React.MouseEvent<HTMLElement>) => {
    if (currentMouseOver.current) {
      const c = currentMouseOver.current[1]
      // console.log(
      //   ">>out",
      //   ev.target,
      //   ev.relatedTarget,
      //   c,
      //   c.contains(ev.target as Element),
      //   c.contains(ev.relatedTarget as Element),
      //   (ev.relatedTarget as Element).contains(c),
      // )
      if (
        c.contains(ev.relatedTarget as Element) ||
        c.contains(ev.target as Element) // x.contains(x) => true!
      ) {
        // ignore
        return
      }
      // console.log(">>> LEFT")
      onElementLeft({ elementID: currentMouseOver.current[0] })
      currentMouseOver.current = null
    }
  }

  const onClick = (ev: React.MouseEvent<HTMLElement>) => {
    const elementID = getElementID(ev.target as Element)
    if (elementID) {
      onElementClicked({ elementID })
    }
  }

  const getElementID = (target: Element, depth = 5): string | null => {
    let el: Element | null = target
    let i = 0
    while (el && i <= depth) {
      const attr = el.attributes
      if (!attr) return null
      const elementID = attr[SLATE_ID_ATTRIBUTE as any]?.value
      if (elementID) {
        return elementID
      }

      i += 1
      el = el.parentElement
    }
    return null
  }

  const onDrop = (event: React.DragEvent) => {
    // No matter the state of the event, treat it as being handled by returning
    // true here, Slate will skip its own event handler
    console.log(">>> onDrop", event)
    return true
  }

  const onDragStart = (event: React.DragEvent) => {
    // No matter the status of the event, treat event as *not* being handled by
    // returning false, Slate will execute its own event handler afterward
    console.log(">>> onDragStart", event)
    return false
  }

  return (
    <div data-pihanga={cardName} style={style?.outer} className={_cls("root")}>
      <Slate editor={editor} initialValue={initialV}>
        <Editable
          id={cardName}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onKeyDown={onKeyDown}
          onClick={onClick}
          onDrop={onDrop}
          onDragStart={onDragStart}
          onMouseOver={onMouseOver}
          onMouseOut={onMouseOut}
          readOnly={readonly}
        />
      </Slate>
    </div>
  )
}
