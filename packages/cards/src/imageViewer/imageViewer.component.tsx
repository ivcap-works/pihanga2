import React from "react"
import { PiCardProps } from "@pihanga/core"
import { ComponentEvents, ImageViewerProps } from "../types/imageViewer"

export type ComponentProps = ImageViewerProps & {}

export const ImageViewerComponent = (
  props: PiCardProps<ComponentProps, ComponentEvents>,
): React.ReactNode => {
  const { imgURL, caption, width, height, onClicked, cardName, _cls } = props

  let w: number | string = width && width > 0 ? width : 1
  if (w <= 1) {
    w = `${w * 100}%`
  }
  let h: number | string | undefined = height && height > 0 ? height : undefined
  if (h && h <= 1) {
    h = `${h * 100}%`
  }

  const ip = {
    src: imgURL,
    height: h,
    width: w,
  }
  return (
    <div className={_cls("root")} data-pihanga={cardName}>
      <img {...ip} alt={caption} onClick={() => onClicked({})} />
    </div>
  )
}
