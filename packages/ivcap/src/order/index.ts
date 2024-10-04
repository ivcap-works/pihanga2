import { PropT } from "../common"
import { ReduxState, PiRegister, ReduceF, ReduxAction } from "@pihanga2/core"
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
import { GetOAuthContext } from "../auth/common"

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
    reducerF: ReduceF<S, ReduxAction & OrderListEvent>,
  ) => void
  get: (
    props: PropT<LoadOrderRecordEvent>,
    reducerF: ReduceF<S, ReduxAction & OrderRecordEvent>,
  ) => void
  create: (
    props: PropT<CreateOrderEvent>,
    reducerF: ReduceF<S, ReduxAction & OrderCreatedEvent>,
  ) => void
}

export function orders<S extends ReduxState>(register: PiRegister): Order<S> {
  return {
    list: getOrderList<S>(register),
    get: getOrderRecord<S>(register),
    create: createOrder<S>(register),
  }
}

export function orderInit(register: PiRegister): void {
  createInit(register)
  getInit(register)
  listInit(register)
}
