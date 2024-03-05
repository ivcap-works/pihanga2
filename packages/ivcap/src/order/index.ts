import { PropT, PromiseT } from "../common"
import { ReduxState, PiRegister } from "@pihanga2/core"
import {
  CreateOrderEvent,
  OrderCreatedEvent,
  createOrder,
  createInit,
} from "./order.create"
import {
  OrderRecordEvent,
  LoadOrderRecordEvent,
  getOrderRecord,
  getInit,
} from "./order.get"
import {
  OrderListEvent,
  LoadOrderListEvent,
  getOrderList,
  listInit,
} from "./order.list"

export {
  dispatchIvcapCreateOrder,
  onOrderCreated,
  createOrder,
} from "./order.create"
export type {
  CreateOrderEvent,
  OrderCreatedEvent,
} from "./order.create"
export {
  dispatchIvcapGetOrderRecord,
  onOrderRecord,
  getOrderRecord,
} from "./order.get"
export type {
  OrderRecordEvent,
  OrderRecord,
  LoadOrderRecordEvent,
} from "./order.get"
export {
  dispatchIvcapGetOrderList,
  onOrderList,
  getOrderList,
} from "./order.list"
export type {
  OrderListEvent,
  OrderListItem,
  LoadOrderListEvent,
} from "./order.list"

export interface Order<S extends ReduxState> {
  list: (
    props: PropT<LoadOrderListEvent>,
  ) => PromiseT<S, OrderListEvent>
  get: (
    props: PropT<LoadOrderRecordEvent>,
  ) => PromiseT<S, OrderRecordEvent>
  create: (
    props: PropT<CreateOrderEvent>,
  ) => PromiseT<S, OrderCreatedEvent>
}

export function orders<S extends ReduxState>(apiURL: URL, register: PiRegister): Order<S> {
  return {
    list: getOrderList<S>(apiURL, register),
    get: getOrderRecord<S>(apiURL, register),
    create: createOrder<S>(apiURL, register),
  }
}

export function orderInit(register: PiRegister): void {
  createInit(register)
  getInit(register)
  listInit(register)
}
