import {
  PiRegister,
  onShowPage,
} from "@pihanga2/core"
import { AppState } from "./app.types"

export function reducerInit(register: PiRegister): void {
  onShowPage<AppState>(register, () => {
    console.log(">>> showPage")
  })
}
