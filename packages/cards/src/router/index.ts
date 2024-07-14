import { PiRegister } from "@pihanga2/core"

import { RouterComponent } from "./router.component"
import { ROUTER_CARD } from "./router.types"

export * from "./router.types"

export function routerInit(register: PiRegister): void {
  register.cardComponent({
    name: ROUTER_CARD,
    component: RouterComponent,
  })
}
