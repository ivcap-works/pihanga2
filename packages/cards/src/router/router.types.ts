import { PiCardRef, createCardDeclaration } from "@pihanga2/core"

export const ROUTER_CARD = "router"
export const Router = createCardDeclaration<RouterProps>(ROUTER_CARD)

export type RouterProps = {
  contentCard: PiCardRef
}
