import type { ReduxState } from "@pihanga2/core"

export const TITLE = "Tohu"
export const LONG_TITLE = "Tohu, your Sciene Digital Guide"

export type AppState = ReduxState & {
  count: number
}

export enum AppCard {
  Framework = "page",
  Main = "app/main",
}