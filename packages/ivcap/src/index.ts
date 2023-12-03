// import { PiRegister } from "@pihanga/core";
// import { init as serviceInit } from "./service";
// import { init as orderInit } from "./order";
import { PiRegister } from "@pihanga/core"
import { init as artifactInit } from "./artifact"
// import { init as metadataInit } from "./NEEDS_WORK/metadata";

// export * from "./actions";
// export * from "./service";
// export * from "./order";
export * from "./artifact"
export type * from "./artifact"
// export * from "./common";
// export * from "./NEEDS_WORK/metadata";
export * from "./actions";

let _accessToken: string | undefined = undefined

export type URL = string
export type URN = string

export function init(register: PiRegister): void {
  // serviceInit(register);
  // orderInit(register);
  artifactInit(register)
  // metadataInit(register);
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
