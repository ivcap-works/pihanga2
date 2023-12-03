import React from "react"
import { PiCardProps } from "@pihanga/core"
import { TbButtonType } from "../constants"
import { TbIcon } from "../../components"
//import styles from "./buitton.module.css"

export type ComponentProps = {
  name: string // used in event
  title: string
  buttonType: TbButtonType
  isGhostButton: boolean
  iconName?: string
  style?: React.CSSProperties
  iconStyle?: React.CSSProperties
}

export type ButtonClickedEvent = {
  name: string
}

export type ComponentEvents = {
  onClicked: ButtonClickedEvent
}

export const Component = (
  props: PiCardProps<ComponentProps, ComponentEvents>,
): React.ReactNode => {
  const {
    name,
    title,
    buttonType = TbButtonType.Primary,
    isGhostButton = false,
    iconName,
    style,
    iconStyle,
    cardName,
    onClicked,
  } = props
  // const cls = (...n: string[]) => props._cls(n[0], styles)

  function onClick() {
    onClicked({ name })
  }

  const cls = isGhostButton ? `btn-ghost-${buttonType}` : `btn-${buttonType}`
  const s = style || {}
  return (
    <button onClick={onClick} className={`btn ${cls}`} data-pihanga={cardName}>
      <TbIcon iconName={iconName} iconStyle={iconStyle} />
      <span style={s}>{title}</span>
    </button>
  )
}
