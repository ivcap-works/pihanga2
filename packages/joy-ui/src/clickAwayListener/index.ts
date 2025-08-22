import {
  PiRegister,
  actionTypesToEvents,
  createCardDeclaration,
} from "@pihanga2/core"

import { ClickedAwayComponent } from "./clickAwayListener.component"
import {
  CLICK_AWAY_LISTENER_CARD,
  CLICK_AWAY_LISTENER_ACTION,
  ClickAwayListenerProps,
} from "@pihanga2/cards"

export const JY_CLICK_AWAY_LISTENER_CARD = "joy/" + CLICK_AWAY_LISTENER_CARD
export const JyClickedAwayListener =
  createCardDeclaration<ClickAwayListenerProps>(JY_CLICK_AWAY_LISTENER_CARD)

export function initClickedAwayListener(register: PiRegister): void {
  register.cardComponent({
    name: JY_CLICK_AWAY_LISTENER_CARD,
    component: ClickedAwayComponent,
    events: actionTypesToEvents(CLICK_AWAY_LISTENER_ACTION),
  })
}
