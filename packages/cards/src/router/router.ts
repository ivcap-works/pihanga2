import { PiCardRef, createCardDeclaration } from "@pihanga2/core"

export const ROUTER_TYPE = "router"
export const Router = createCardDeclaration<RouterProps>(ROUTER_TYPE)

export type RouterProps = {
  contentCard: PiCardRef
}
