import { v4 as uuidv4 } from "uuid"
import {
  PiRegister,
  ReduxState,
  ReduxAction,
  createOnAction,
  DispatchF,
} from "@pihanga2/core"
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
  CommonProps,
} from "../common"
import { SERVICE_ACTION } from "./service.actions"

export type Cursor = string
export type ServiceListEvent = ListEvent & {
  services: ServiceListItem[]
  offset: number
  nextPage?: Cursor
  prevPage?: Cursor
}

export type ServiceListItem = {
  id: string;
  name: string;
  description?: string;
  account: string;
  href: URL;
}

export type LoadServiceListEvent = LoadListEvent<ServiceListEvent>

export function dispatchIvcapGetServiceList(
  ev: LoadServiceListEvent,
  dispatch: DispatchF,
): void {
  const a = createListAction(SERVICE_ACTION.LOAD_LIST, ev)
  dispatch(a)
}

export const onServiceList = createOnAction<ServiceListEvent>(
  SERVICE_ACTION.LIST,
)

export function getServiceList<S extends ReduxState>(
  apiURL: URL,
  register: PiRegister,
): (props: PropT<LoadServiceListEvent>) => PromiseT<S, ServiceListEvent> {
  return (props: PropT<LoadServiceListEvent>) => {
    const reqID = uuidv4()
    dispatchIvcapGetServiceList(
      { apiURL: apiURL.toString(), reqID, ...props },
      register.reducer.dispatchFromReducer,
    )
    return getPromise<S, ServiceListEvent>(SERVICE_ACTION.LIST, register, reqID)
  }
}

//====== API HANDLER

export function listInit(register: PiRegister): void {
  register.GET<ReduxState, ReduxAction & LoadServiceListEvent, any>({
    ...CommonProps("loadServiceList"),
    url: createListUrlBuilder("services"),
    request: (a, _) => ({ ...a, page: removePageOffset(a) } as any),
    trigger: SERVICE_ACTION.LOAD_LIST,
    reply: (state, content: any, dispatch, { request }) => {
      const services = (content.items || []).map(toServiceListItem)
      const offset = getOffsetFromPage(request.page)
      const nextPage = addOffsetFromPage(offset + services.length, getNextPage(content.links))
      const ev: ServiceListEvent = {
        services,
        offset,
        nextPage,
        prevPage: request.page,
      }
      dispatchEvent(ev, SERVICE_ACTION.LIST, dispatch, request)
      return state
    },
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

function toServiceListItem(els: any): ServiceListItem {
  // {
  //   "account": "urn:ivcap:account:45a06508-5c3a-4678-8e6d-e6399bf27538",
  //   "description": "A simple IVCAP service creating a thumbnail and reporting stats on a collection of images",
  //   "href": "https://develop.ivcap.net/1/services/19f9c31e-8cc5-531f-8dc4-c4684fad0a33",
  //   "id": "urn:ivcap:service:19f9c31e-8cc5-531f-8dc4-c4684fad0a33",
  //   "name": "image-analysis-example"
  // }
  return {
    id: els.id,
    name: els.name,
    description: (els.description && els.description !== "") ? els.description : null,
    account: els.account,
    href: els.href
  }
}
