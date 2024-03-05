import { PiRegister } from "@pihanga2/core"

import { RouterComponent } from "./router.component"
import { ROUTER_TYPE } from "./router"

export * from "./router"

export function routerInit(register: PiRegister): void {
  register.cardComponent({
    name: ROUTER_TYPE,
    component: RouterComponent,
  })
}
