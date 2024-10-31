import React from "react"
import { SxProps } from "@mui/material"
import { PiCardProps } from "@pihanga2/core"
import { ImageViewerEvents, ImageViewerProps } from "./imageViewer"

export type ComponentProps = ImageViewerProps & {
  sx?: ImageViewerX
}

export type ImageViewerX = {}

const DEF_CSS = {
  maxWidth: "100%",
}

export const ImageViewerComponent = (
  props: PiCardProps<ComponentProps, ImageViewerEvents>,
): React.ReactNode => {
  const {
    imgURL,
    caption,
    width,
    minWidth,
    maxWidth,
    height,
    onClicked,
    cardName,
    _cls,
  } = props

  let w: number | string | undefined = width && width > 0 ? width : undefined
  if (w && w <= 1) {
    w = `${w * 100}%`
  }
  let h: number | string | undefined = height && height > 0 ? height : undefined
  if (h && h <= 1) {
    h = `${h * 100}%`
  }

  let style: any = {
    ...DEF_CSS,
    ...props.style,
  }
  if (maxWidth) {
    style.maxWidth = maxWidth
  }
  if (minWidth) {
    style.minWidth = minWidth
  }

  const ip = {
    src: imgURL,
    height: h,
    width: w,
    alt: caption,
    style,
  }

  function renderImg() {
    return <img {...ip} alt={caption} onClick={() => onClicked({})} />
  }

  function renderSpinner() {
    return null
  }

  return (
    <div className={_cls("root")} data-pihanga={cardName}>
      {imgURL ? renderImg() : renderSpinner()}
    </div>
  )
}
