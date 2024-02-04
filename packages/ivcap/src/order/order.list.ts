import { v4 as uuidv4 } from "uuid"
import {
  PiRegister,
  ReduxState,
  ReduxAction,
  createOnAction,
  DispatchF,
} from "@pihanga/core"
import { getAccessToken } from ".."
import { createListAction, ListEvent, LoadListEvent } from "../actions"
import {
  getNextPage,
  createListUrlBuilder,
  restErrorHandling,
  dispatchEvent,
  PromiseT,
  PropT,
  getPromise,
} from "../common"
import { ORDER_ACTION } from "./order.actions"

export type Cursor = string
export type OrderListEvent = ListEvent & {
  orders: OrderListItem[]
  offset: number
  nextPage?: Cursor
  prevPage?: Cursor
}

export type OrderListItem = {
  id: string;
  name: string;
  status: string;
  orderedAt: Date;
  startedAt?: Date;
  finishedAt?: Date;
  service: string;
  account: string;
  href: URL;
}

export type LoadOrderListEvent = LoadListEvent<OrderListEvent>

export function dispatchIvcapGetOrderList(
  ev: LoadOrderListEvent,
  dispatch: DispatchF,
): void {
  const a = createListAction(ORDER_ACTION.LOAD_LIST, ev)
  dispatch(a)
}

export const onOrderList = createOnAction<OrderListEvent>(
  ORDER_ACTION.LIST,
)

export function getOrderList<S extends ReduxState>(
  apiURL: URL,
  register: PiRegister,
): (props: PropT<LoadOrderListEvent>) => PromiseT<S, OrderListEvent> {
  return (props: PropT<LoadOrderListEvent>) => {
    const reqID = uuidv4()
    dispatchIvcapGetOrderList(
      { apiURL: apiURL.toString(), reqID, ...props },
      register.reducer.dispatchFromReducer,
    )
    return getPromise<S, OrderListEvent>(ORDER_ACTION.LIST, register, reqID)
  }
}

//====== API HANDLER

export function listInit(register: PiRegister): void {
  register.GET<ReduxState, ReduxAction & LoadOrderListEvent, any>({
    name: "loadOrderList",
    origin: ({ apiURL }, _) => apiURL,
    url: createListUrlBuilder("orders"),
    request: (a, _) => ({ ...a, page: removePageOffset(a) } as any),
    trigger: ORDER_ACTION.LOAD_LIST,
    headers: () => ({ Authorization: `Bearer ${getAccessToken()}` }),
    reply: (state, content: any, dispatch, { request }) => {
      const orders = (content.items || []).map(toOrderListItem)
      const offset = getOffsetFromPage(request.page)
      const nextPage = addOffsetFromPage(offset + orders.length, getNextPage(content.links))
      const ev: OrderListEvent = {
        orders,
        offset,
        nextPage,
        prevPage: request.page,
      }
      dispatchEvent(ev, ORDER_ACTION.LIST, dispatch, request)
      return state
    },
    error: restErrorHandling("ivcap-api:loadOrderList"),
  })
}

function removePageOffset(props: any): string | undefined {
  const page = props.page
  if (page) {
    return page.split(":")[0]
  } else {
    return undefined
  }
}

function getOffsetFromPage(page?: string): number {
  return page ? Number(page.split(":")[1]) : 0
}

function addOffsetFromPage(offset: number, page?: string): string | undefined {
  return page ? `${page}:${offset}` : undefined
}

function toOrderListItem(els: any): OrderListItem {
  // {
  //   "account": "urn:ivcap:account:45a06508-5c3a-4678-8e6d-e6399bf27538",
  //   "finished-at": "2023-11-03T04:59:35Z",
  //   "href": "https://develop.ivcap.net/1/orders/54835642-2447-45cc-92c4-a1235f8120bb",
  //   "id": "urn:ivcap:order:54835642-2447-45cc-92c4-a1235f8120bb",
  //   "name": "Order 54835642-2447-45cc-92c4-a1235f8120bb",
  //   "ordered-at": "2023-11-03T04:58:46Z",
  //   "service": "urn:ivcap:service:19f9c31e-8cc5-531f-8dc4-c4684fad0a33",
  //   "started-at": "2023-11-03T04:59:19Z",
  //   "status": "failed"
  // }
  return {
    id: els.id,
    name: els.name,
    status: els.status,
    orderedAt: toDate("ordered-at", els)!,
    startedAt: toDate("started-at", els),
    finishedAt: toDate("finished-at", els),
    service: els.service,
    account: els.account,
    href: els.href,
  };
}

function toDate(name: string, els: any): Date | undefined {
  const v = els[name];
  return v ? new Date(v) : undefined;
}
