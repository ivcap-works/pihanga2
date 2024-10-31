import { PropT } from "../common"
import { ReduxState, PiRegister, ReduceF, ReduxAction } from "@pihanga2/core"
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

export { dispatchIvcapCreateAspect, onAspectUploaded } from "./aspect.create"
export type { CreateAspectEvent, AspectCreatedEvent } from "./aspect.create"
export { dispatchIvcapGetAspectRecord, onAspectRecord } from "./aspect.get"
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

export interface Aspect<S extends ReduxState, C = any> {
  list: (
    props: PropT<LoadAspectListEvent>,
    reducerF: ReduceF<S, ReduxAction & AspectListEvent>,
  ) => void
  get: (
    props: PropT<LoadAspectRecordEvent>,
    reducerF: ReduceF<S, ReduxAction & AspectRecordEvent>,
  ) => void
  create: (
    props: PropT<CreateAspectEvent<C>>,
    reducerF: ReduceF<S, ReduxAction & AspectCreatedEvent> | null,
  ) => void
}

export function aspects<S extends ReduxState, C = any>(
  register: PiRegister,
): Aspect<S, C> {
  return {
    list: getAspectList<S>(register),
    get: getAspectRecord<S>(register),
    create: createAspect<S>(register),
  }
}

export function aspectInit(register: PiRegister): void {
  createInit(register)
  getInit(register)
  listInit(register)
}
