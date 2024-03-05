import { PiRegister } from "@pihanga2/core";
import { commonInit } from "./common"
import { auth0Init } from "./auth0"

export * from "./auth.actions"
export { registerIvcapDeployment } from "./common"

export function authInit(register: PiRegister): void {
  commonInit(register)
}
