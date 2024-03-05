import { PropT, PromiseT } from "../common"
import { ReduxState, PiRegister } from "@pihanga2/core"
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
  ) => PromiseT<S, ServiceListEvent>
  get: (
    props: PropT<LoadServiceRecordEvent>,
  ) => PromiseT<S, ServiceRecordEvent>
  // create: (
  //   props: PropT<CreateServiceEvent>,
  // ) => PromiseT<S, ServiceCreatedEvent>
}

export function services<S extends ReduxState>(apiURL: URL, register: PiRegister): Service<S> {
  return {
    list: getServiceList<S>(apiURL, register),
    get: getServiceRecord<S>(apiURL, register),
    // create: createService<S>(apiURL, register),
  }
}

export function serviceInit(register: PiRegister): void {
  getInit(register)
  listInit(register)
}
