import { createOnAction, registerActions } from "@pihanga/core"
import type { PiCardRef, ReduxState } from "@pihanga/core"

export const SERVICES = ["orders", "artifacts", "services"]
export const DEF_SERVICE = SERVICES[1]

export type AppState = ReduxState & {
  contentCard?: PiCardRef

  counter: {
    value: number
  }
  array: number[]
}

export const ACTION_TYPES = registerActions("app", ["inc"])
export type ClickEvent = { foo?: string }
export const onIncrement = createOnAction<ClickEvent>(ACTION_TYPES.INC)
