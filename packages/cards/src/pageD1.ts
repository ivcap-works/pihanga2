import { PiCardRef, createCardDeclaration } from "@pihanga2/core"

export const PAGE_D1_CARD = "pageD1"
export const PageD1 = createCardDeclaration<PageD1Props>(PAGE_D1_CARD)

export type PageD1Props<S = any, T = any> = {
  contentCards: PiCardRef[]
  hideColorSchemeToggle?: boolean

  className?: string
  style?: S
  theme?: T
}
