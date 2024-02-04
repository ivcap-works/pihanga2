import { PiRegister, actionTypesToEvents } from "@pihanga/core"

import { GoogleMapComponent } from "./googleMap.component"
import { GOOGLE_MAP_ACTION, GOOGLE_MAP_TYPE } from "./googleMap"

export * from "./googleMap"

export function googleMapInit(register: PiRegister): void {
  register.cardComponent({
    name: GOOGLE_MAP_TYPE,
    component: GoogleMapComponent,
    events: actionTypesToEvents(GOOGLE_MAP_ACTION),
  })
}
