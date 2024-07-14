import { PiRegister, actionTypesToEvents } from "@pihanga2/core"

import { FileDropComponent } from "./fileDrop.component"
import { FILE_DROP_ACTION, FILE_DROP_CARD } from "./fileDrop.types"

export * from "./fileDrop.types"

export function fileDropInit(register: PiRegister): void {
  register.cardComponent({
    name: FILE_DROP_CARD,
    component: FileDropComponent,
    events: actionTypesToEvents(FILE_DROP_ACTION),
  })
}
