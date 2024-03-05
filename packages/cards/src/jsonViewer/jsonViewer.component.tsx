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
    displayObjectSize = false,
    displayDataTypes = false,
    modifyFn,
    cardName,
    _cls,
  } = props
  const elRef = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    if (modifyFn) {
      modifyFn(source, elRef.current)
    }
  }, [modifyFn, source])

  const p = {
    src: source,
    theme,
    iconStyle,
    displayObjectSize,
    displayDataTypes,
  } as ReactJsonViewProps

  return (
    <div className={_cls("root")} ref={elRef} data-pihanga={cardName}>
      {/* <ReactJson  {...p} />  not sure why this is no longer working */}
      {React.createElement(ReactJson, p)}
    </div>
  )
}
