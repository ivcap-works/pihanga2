import { v4 as uuidv4 } from "uuid"
import {
  PiRegister,
  ReduxState,
  ReduxAction,
  createOnAction,
  DispatchF,
} from "@pihanga/core"
import { URN, getAccessToken } from ".."
import { createReadAction, LoadRecordEvent } from "../actions"
import {
  restErrorHandling,
  dispatchEvent,
  PromiseT,
  PropT,
  getPromise,
  RequestEvent,
} from "../common"
import { ORDER_ACTION } from "./order.actions"

export type OrderRecordEvent = RequestEvent & {
  order: OrderRecord
}

export type OrderRecord = {
  id: string;
  name?: string;
  status: string;
  orderedAt: string;
  startedAt?: string;
  finishedAt?: string;
  parameters: OrderParameter[];
  products: OrderProduct[];
  service: URN;
  account: URN;
  policy?: URN;
};

export type OrderParameter = {
  name: string;
  value: string | number | URN;
};

export type OrderProduct = {
  id: string;
  name: string;
  status: string;
  mimeType?: string;
  size?: number;
  dataURL?: string;
  href: URL;
};

export type LoadOrderRecordEvent = LoadRecordEvent<OrderRecordEvent>

export function dispatchIvcapGetOrderRecord(
  ev: LoadOrderRecordEvent,
  dispatch: DispatchF,
): void {
  const a = createReadAction(ORDER_ACTION.LOAD_RECORD, ev)
  dispatch(a)
}

export const onOrderRecord = createOnAction<OrderRecordEvent>(
  ORDER_ACTION.RECORD,
)

export function getOrderRecord<S extends ReduxState>(
  apiURL: URL,
  register: PiRegister,
): (props: PropT<LoadOrderRecordEvent>) => PromiseT<S, OrderRecordEvent> {
  return (props: PropT<LoadOrderRecordEvent>) => {
    const reqID = uuidv4()
    dispatchIvcapGetOrderRecord(
      { apiURL: apiURL.toString(), reqID, ...props },
      register.reducer.dispatchFromReducer,
    )
    return getPromise<S, OrderRecordEvent>(
      ORDER_ACTION.RECORD,
      register,
      reqID,
    )
  }
}

//====== API HANDLER

export function getInit(register: PiRegister): void {
  register.GET<ReduxState, ReduxAction & LoadOrderRecordEvent, any>({
    name: "getOrderRecord",
    origin: ({ apiURL }, _) => apiURL,
    url: "/1/orders/:id",
    trigger: ORDER_ACTION.LOAD_RECORD,
    request: ({ id }, _) => ({ id }),
    headers: () => ({ Authorization: `Bearer ${getAccessToken()}` }),
    reply: (state, content: any, dispatch, { request }) => {
      const ev: OrderRecordEvent = {
        order: toOrderRecord(content),
      }
      dispatchEvent(ev, ORDER_ACTION.RECORD, dispatch, request)
      return state
    },
    error: restErrorHandling("ivcap-api:getOrderRecord"),
  })
}

export function toOrderRecord(els: any): OrderRecord {
  // {
  //   "account": "urn:ivcap:account:45a06508-5c3a-4678-8e6d-e6399bf27538",
  //   "finished-at": "2023-11-08T06:59:35Z",
  //   "id": "urn:ivcap:order:f7f09d86-a0d3-4695-8019-38de6d6d6255",
  //   "name": "Order f7f09d86-a0d3-4695-8019-38de6d6d6255",
  //   "ordered-at": "2023-11-08T06:54:38Z",
  //   "service": "urn:ivcap:service:19f9c31e-8cc5-531f-8dc4-c4684fad0a33",
  //   "started-at": "2023-11-08T06:59:16Z",
  //   "status": "succeeded"
  //   "parameters": [
  //     {
  //       "name": "cayp-order-id",
  //       "value": "urn:ivcap:order:f7f09d86-a0d3-4695-8019-38de6d6d6255"
  //     },
  //   ],
  //   "products": {
  //     "items": [
  //       {
  //         "dataRef": "https://develop.ivcap.net/1/artifacts/0ed09613-4bb0-4931-89ab-23cb22bea6e8/blob",
  //         "href": "https://develop.ivcap.net/1/artifacts/0ed09613-4bb0-4931-89ab-23cb22bea6e8",
  //         "id": "urn:ivcap:artifact:0ed09613-4bb0-4931-89ab-23cb22bea6e8",
  //         "mime-type": "application/json",
  //         "name": "",
  //         "size": 369,
  //         "status": ""
  //       },
  //     ],
  //     "links": []
  //   },
  // }
  //
  const parameters = (els.parameters || []).map((p: any) => {
    return {
      name: p.name,
      value: p.value,
    };
  });

  const products = (els.products?.items || []).map((p: any) => {
    return {
      id: p.id,
      name: p.name,
      status: p.status,
      mimeType: p["mime-type"],
      size: p.number,
      dataURL: p.dataRef,
      href: p.href
    };
  });

  return {
    id: els.id,
    name: els.name,
    status: els.status,
    orderedAt: els["ordered-at"],
    startedAt: els["started-at"],
    finishedAt: els["finished-at"],
    parameters,
    products,
    service: els.service?.id,
    account: els.account?.id,
    policy: els.policy
  };
}
