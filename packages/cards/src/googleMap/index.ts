import { PiRegister, actionTypesToEvents } from "@pihanga2/core"

import { GoogleMapComponent } from "./googleMap.component"
import { GOOGLE_MAP_ACTION, GOOGLE_MAP_CARD } from "./googleMap.types"

export * from "./googleMap.types"

export function googleMapInit(register: PiRegister): void {
  register.cardComponent({
    name: GOOGLE_MAP_CARD,
    component: GoogleMapComponent,
    events: actionTypesToEvents(GOOGLE_MAP_ACTION),
  })
}
