import { PropT, PromiseT } from "../common"
import { ReduxState, PiRegister } from "@pihanga2/core"
import {
  CreateAspectEvent,
  AspectCreatedEvent,
  createAspect,
  createInit,
} from "./aspect.create"
import {
  AspectRecordEvent,
  LoadAspectRecordEvent,
  getAspectRecord,
  getInit,
} from "./aspect.get"
import {
  AspectListEvent,
  LoadAspectListEvent,
  getAspectList,
  listInit,
} from "./aspect.list"

export {
  dispatchIvcapCreateAspect,
  onAspectUploaded,
} from "./aspect.create"
export type {
  CreateAspectEvent,
  AspectCreatedEvent,
} from "./aspect.create"
export {
  dispatchIvcapGetAspectRecord,
  onAspectRecord,
} from "./aspect.get"
export type {
  AspectRecordEvent,
  AspectRecord,
  LoadAspectRecordEvent,
} from "./aspect.get"
export { dispatchIvcapGetAspectList, onAspectList } from "./aspect.list"
export type {
  AspectListEvent,
  AspectListItem,
  LoadAspectListEvent,
} from "./aspect.list"

export interface Aspect<S extends ReduxState> {
  list: (
    props: PropT<LoadAspectListEvent>,
  ) => PromiseT<S, AspectListEvent>
  get: (
    props: PropT<LoadAspectRecordEvent>,
  ) => PromiseT<S, AspectRecordEvent>
  create: (
    props: PropT<CreateAspectEvent>,
  ) => PromiseT<S, AspectCreatedEvent>
}

export function aspects<S extends ReduxState>(apiURL: URL, register: PiRegister): Aspect<S> {
  return {
    list: getAspectList<S>(apiURL, register),
    get: getAspectRecord<S>(apiURL, register),
    create: createAspect<S>(apiURL, register),
  }
}

export function aspectInit(register: PiRegister): void {
  createInit(register)
  getInit(register)
  listInit(register)
}
