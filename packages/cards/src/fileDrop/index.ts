import { PiRegister, actionTypesToEvents } from "@pihanga2/core"

import { FileDropComponent } from "./fileDrop.component"
import { FILE_DROP_ACTION, FILE_DROP_TYPE } from "./fileDrop"

export * from "./fileDrop"

export function fileDropInit(register: PiRegister): void {
  register.cardComponent({
    name: FILE_DROP_TYPE,
    component: FileDropComponent,
    events: actionTypesToEvents(FILE_DROP_ACTION),
  })
}
