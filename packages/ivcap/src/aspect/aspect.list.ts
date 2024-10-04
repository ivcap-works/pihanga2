import {
  PiRegister,
  ReduxState,
  ReduxAction,
  createOnAction,
  DispatchF,
  ReduceF,
} from "@pihanga2/core"
import { URN } from ".."
import { createListAction, ListEvent, LoadListEvent } from "../actions"
import {
  getNextPage,
  createListUrlBuilder,
  restErrorHandling,
  dispatchEvent,
  PropT,
  CommonProps,
  makeAPI,
} from "../common"
import { ASPECT_ACTION } from "./aspect.actions"

export type Cursor = string
export type AspectListEvent = ListEvent & {
  aspects: AspectListItem[]
  offset: number
  nextPage?: Cursor
  prevPage?: Cursor
}

export type AspectListItem = {
  id: string
  entity: string
  schema: string
  contentType: string
  content: any
}

export type LoadAspectListEvent = LoadListEvent<AspectListEvent> & {
  entity?: URN
  schema?: URN
  contentPath?: string
  includeContent?: boolean
}


export function dispatchIvcapGetAspectList(
  ev: LoadAspectListEvent,
  dispatch: DispatchF,
): void {
  const a = createListAction(ASPECT_ACTION.LOAD_LIST, ev)
  dispatch(a)
}

export const onAspectList = createOnAction<AspectListEvent>(
  ASPECT_ACTION.LIST,
)

export function getAspectList<S extends ReduxState>(
  register: PiRegister,
): (props: PropT<LoadAspectListEvent>, reducerF: ReduceF<S, ReduxAction & AspectListEvent>) => void {
  return makeAPI<S, LoadAspectListEvent, AspectListEvent>(
    register, ASPECT_ACTION.LIST, dispatchIvcapGetAspectList
  )
  // return (props: PropT<LoadAspectListEvent>) => {
  //   const reqID = uuidv4()
  //   dispatchIvcapGetAspectList(
  //     { apiURL: apiURL.toString(), reqID, ...props },
  //     register.reducer.dispatchFromReducer,
  //   )
  //   return getPromise<S, AspectListEvent>(ASPECT_ACTION.LIST, register, reqID)
  // }
}


//type History = Cursor[]
// const Page2Prev: { [k: Cursor]: Cursor } = {}

//====== API HANDLER

export function listInit(register: PiRegister): void {
  register.GET<ReduxState, ReduxAction & LoadAspectListEvent, any>({
    ...CommonProps("loadAspectList"),
    url: createListUrlBuilder("aspects", {
      entity: "entity", schema: "schema", "content-path": "contentPath",
      "include-content": "includeContent"
    }),
    request: (a, _) => ({ ...a, page: removePageOffset(a) } as any),
    trigger: ASPECT_ACTION.LOAD_LIST,
    reply: (state, content: any, dispatch, { request }) => {
      const aspects = (content.items || []).map(toAspectListItem)
      const offset = getOffsetFromPage(request.page)
      const nextPage = addOffsetFromPage(offset + aspects.length, getNextPage(content.links))
      const ev: AspectListEvent = {
        aspects,
        offset,
        nextPage,
        prevPage: request.page,
      }
      dispatchEvent(ev, ASPECT_ACTION.LIST, dispatch, request)
      return state
    },
    error: restErrorHandling("ivcap-api:loadAspectList"),
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

function toAspectListItem(els: any): AspectListItem {
  // id: 'urn:ivcap:aspect:ffdc4959-c636-4242-8f12-b727e1663b01',
  // entity: 'urn:ivcap:artifact:92221d7d-150d-4ca1-90f3-20725049d8b1',
  // schema: 'urn:common:schema:image.1',
  // content: {
  //   ...
  // },
  // 'content-type': 'application/json'
  return {
    id: els.id,
    entity: els.entity,
    schema: els.schema,
    contentType: els["content-type"],
    content: els.content,
  }
}
