import { PiRegister } from "@pihanga/core"
import { artifactInit } from "./artifact"
import { aspectInit } from "./aspect"
import { serviceInit } from "./service";
import { orderInit } from "./order";

export * from "./actions";
export * from "./service";
export * from "./order";
export * from "./artifact"
export type * from "./artifact"
export * from "./aspect"
export type * from "./aspect"
export * from "./common";
export * from "./actions";

let _accessToken: string | undefined = undefined

export type URL = string
export type URN = string
export type * from "./common"

export function ivcapInit(register: PiRegister): void {
  artifactInit(register)
  aspectInit(register)
  orderInit(register);
  serviceInit(register);
}

export function setAccessToken(accessToken: string): void {
  _accessToken = accessToken
}

export function clearAccessToken(): void {
  _accessToken = undefined
}

export function getAccessToken(): string | undefined {
  return _accessToken
}

export function hasAccessToken(): boolean {
  return !!_accessToken
}
