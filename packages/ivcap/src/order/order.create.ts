import { v4 as uuidv4 } from "uuid"
import {
  PiRegister,
  ReduxState,
  ReduxAction,
  createOnAction,
  DispatchF,
} from "@pihanga2/core"
import { URN, getAccessToken } from ".."
import { BaseEvent } from "../actions"
import {
  restErrorHandling,
  dispatchEvent,
  PromiseT,
  PropT,
  getPromise,
  RequestEvent,
  CommonProps,
} from "../common"
import { ORDER_ACTION } from "./order.actions"
import { OrderRecord, toOrderRecord } from "./order.get"

export type CreateOrderEvent = BaseEvent<OrderCreatedEvent> & {
  refID: string; // for internal reference
  name: string;
  serviceID: string;
  parameters: OrderParameter[];
}

export type OrderParameter = {
  name: string;
  value: string | number;
};

export type OrderCreatedEvent = RequestEvent & {
  refID: string,
  order: OrderRecord,
}

export function dispatchIvcapCreateOrder(
  ev: CreateOrderEvent,
  dispatch: DispatchF,
): void {
  const a = { type: ORDER_ACTION.CREATE, ...ev }
  dispatch(a)
}

export const onOrderCreated = createOnAction<OrderCreatedEvent>(
  ORDER_ACTION.CREATED,
)

export function createOrder<S extends ReduxState>(
  apiURL: URL,
  register: PiRegister,
): (props: PropT<CreateOrderEvent>) => PromiseT<S, OrderCreatedEvent> {
  return (props: PropT<CreateOrderEvent>) => {
    const reqID = uuidv4()
    dispatchIvcapCreateOrder(
      { apiURL: apiURL.toString(), reqID, ...props },
      register.reducer.dispatchFromReducer,
    )
    return getPromise<S, OrderCreatedEvent>(
      ORDER_ACTION.CREATED,
      register,
      reqID,
    )
  }
}

//====== API HANDLER

export function createInit(register: PiRegister): void {
  register.POST<ReduxState, ReduxAction & CreateOrderEvent, any>({
    ...CommonProps("createOrder"),
    url: "/1/orders",
    trigger: ORDER_ACTION.CREATE,
    request: ({ name, serviceID, parameters }) => {
      return {
        body: { name, "service": serviceID, parameters },
        contentType: "application/json",
      };
    },
    reply: (state, content: any, dispatch, { request }) => {
      const order = toOrderRecord(content);
      const ev: OrderCreatedEvent = {
        refID: request.refID,
        order,
      };
      dispatchEvent(ev, ORDER_ACTION.CREATED, dispatch, request);
      return state;
    },
  })
}
