import { PiCardProps } from "@pihanga2/core"
import React, { useLayoutEffect, useRef } from "react"
import ReactJson, { ReactJsonViewProps } from "react-json-view"
import { JsonViewerProps, JsonViewerEvents } from "./jsonViewer"

export const ImageViewerComponent = (
  props: PiCardProps<JsonViewerProps, JsonViewerEvents>,
): React.ReactNode => {
  const {
    source,
    theme,
    iconStyle,
    collapsed = 1,
    enableClipboard = false,
    removeQuotesOnKeys,
    displayObjectSize = false,
    displayDataTypes = false,
    modifyFn,
    style = { fontSize: "0.75rem" },
    cardName,
    _cls,
  } = props
  const elRef = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    if (modifyFn) {
      modifyFn(source, elRef.current)
    }
  }, [modifyFn, source])

  const p: ReactJsonViewProps = {
    src: source,
    theme,
    iconStyle,
    collapsed,
    enableClipboard,
    quotesOnKeys: !removeQuotesOnKeys,
    displayObjectSize,
    displayDataTypes,
    style,
  }

  return (
    <div className={_cls("root")} ref={elRef} data-pihanga={cardName}>
      {/* <ReactJson  {...p} />  not sure why this is no longer working */}
      {React.createElement(ReactJson, p)}
    </div>
  )
}
