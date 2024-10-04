import { PiCardRef, createCardDeclaration } from "@pihanga2/core"

export const PAGE_D2_CARD = "pageD2"
export const PageD2 = createCardDeclaration<PageD2Props>(PAGE_D2_CARD)

export type PageD2Props<S = any, T = any> = {
  pageTitle: string
  contentCard: PiCardRef
  headerCard?: PiCardRef
  sidebarCard: PiCardRef
  breadcrumbsCard?: PiCardRef
  actionCard?: PiCardRef
  modalCard?: PiCardRef

  className?: string
  style?: S
  theme?: T
}
