import * as React from "react"

import { Card, PiCardProps } from "@pihanga2/core"
import {
  ClickAwayListenerEvents,
  ClickAwayListenerProps,
} from "@pihanga2/cards"
import ClickAwayListener from "@mui/material/ClickAwayListener"

export const ClickedAwayComponent = (
  props: PiCardProps<ClickAwayListenerProps, ClickAwayListenerEvents>,
): React.ReactNode => {
  const { content, child, onClicked, cardName } = props

  function renderChild() {
    if (content) {
      return <Card cardName={content} parentCard={cardName} />
    }
    if (child) {
      return child
    }
    return <div>{`Missing content for ${cardName}`}</div>
  }
  return (
    <ClickAwayListener onClickAway={() => onClicked({})}>
      {renderChild()}
    </ClickAwayListener>
  )
}
