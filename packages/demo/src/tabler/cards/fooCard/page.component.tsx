import React from "react"
import { PiCardProps } from "@pihanga/core"
import styles from "./page.module.css"

export type ComponentProps = {
  message: string
}

export type SomeEvent = {
  something: string
}

export type ComponentEvents = {
  onSomething: SomeEvent
}

export const Component = (
  props: PiCardProps<ComponentProps, ComponentEvents>,
): React.ReactNode => {
  const { message, cardName } = props
  const cls = (...n: string[]) => props._cls(n[0], styles)

  return (
    <div className={cls("root")} data-pihanga={cardName}>
      {message}
    </div>
  )
}
