import React from "react"
import { PiCardProps } from "@pihanga/core"
import { TbIcon } from "../../components"

export type ComponentProps = {
  id: string // used in event
  title?: string
  iconName?: string
  isActive: boolean
  style?: React.CSSProperties
  titleStyle?: React.CSSProperties

  iconStyle?: React.CSSProperties
}

export type ButtonClickedEvent = {
  id: string
  isActive: boolean
}

export type ComponentEvents = {
  onClicked: ButtonClickedEvent
}

export const Component = (
  props: PiCardProps<ComponentProps, ComponentEvents>,
): React.ReactNode => {
  const {
    cardName,
    id,
    title,
    iconName,
    iconStyle,
    titleStyle,
    isActive,
    onClicked,
  } = props

  function onClick(): void {
    onClicked({ id, isActive })
  }

  const cls = `nav-link nav-link-${cardName} ${isActive ? "active" : ""}`
  const ts = titleStyle || {}
  return (
    <button onClick={onClick} className={cls} data-pihanga={cardName}>
      <TbIcon iconName={iconName} iconStyle={iconStyle} />
      <span style={ts}>{title}</span>
    </button>
  )
}
