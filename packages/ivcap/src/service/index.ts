import { PropT } from "../common"
import { ReduxState, PiRegister, ReduxAction, ReduceF } from "@pihanga2/core"
import {
  ServiceRecordEvent,
  LoadServiceRecordEvent,
  getServiceRecord,
  getInit,
} from "./service.get"
import {
  ServiceListEvent,
  LoadServiceListEvent,
  getServiceList,
  listInit,
} from "./service.list"

export {
  dispatchIvcapGetServiceRecord,
  onServiceRecord,
  getServiceRecord,
} from "./service.get"
export type {
  ServiceRecordEvent,
  ServiceRecord,
  LoadServiceRecordEvent,
} from "./service.get"
export {
  dispatchIvcapGetServiceList,
  onServiceList,
  getServiceList
} from "./service.list"
export type {
  ServiceListEvent,
  ServiceListItem,
  LoadServiceListEvent,
} from "./service.list"

export interface Service<S extends ReduxState> {
  list: (
    props: PropT<LoadServiceListEvent>,
    reducerF: ReduceF<S, ReduxAction & ServiceListEvent>,
  ) => void
  get: (
    props: PropT<LoadServiceRecordEvent>,
    reducerF: ReduceF<S, ReduxAction & ServiceRecordEvent>,
  ) => void
  // create: (
  //   props: PropT<CreateServiceEvent>,
  // ) => PromiseT<S, ServiceCreatedEvent>
}

export function services<S extends ReduxState>(register: PiRegister): Service<S> {
  return {
    list: getServiceList<S>(register),
    get: getServiceRecord<S>(register),
    // create: createService<S>(apiURL, register),
  }
}

export function serviceInit(register: PiRegister): void {
  getInit(register)
  listInit(register)
}
