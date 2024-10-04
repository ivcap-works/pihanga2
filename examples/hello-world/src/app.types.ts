import type { ReduxState } from "@pihanga2/core"

export const TITLE = "Tohu"
export const LONG_TITLE = "Tohu, your Sciene Digital Guide"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const BUILD_INFO = (window as any).buildInfo || {
  version: "???",
  commit: "...",
}

export type AppState = ReduxState & {
  count: number
}

export enum AppCard {
  Framework = "page",
  Main = "app/main",
}