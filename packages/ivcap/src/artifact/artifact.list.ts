import { v4 as uuidv4 } from "uuid"
import {
  PiRegister,
  ReduxState,
  ReduxAction,
  createOnAction,
  DispatchF,
} from "@pihanga2/core"
import { dispatchIvcapAuthError, getAccessToken } from ".."
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
import { ACTION_TYPES } from "./artifact.actions"
import { GetOAuthContext, OAuthContextT } from "../auth/common"

export type Cursor = string
export type ArtifactListEvent = ListEvent & {
  artifacts: ArtifactListItem[]
  offset: number
  nextPage?: Cursor
  prevPage?: Cursor
}

export type ArtifactListItem = {
  id: string
  status: string
  mimeType: string
  name: string
  size: number
  href: string
}

export type LoadArtifactListEvent = LoadListEvent<ArtifactListEvent>

export function dispatchIvcapGetArtifactList(
  ev: LoadArtifactListEvent,
  dispatch: DispatchF,
): void {
  const a = createListAction(ACTION_TYPES.LOAD_LIST, ev)
  dispatch(a)
}

export const onArtifactList = createOnAction<ArtifactListEvent>(
  ACTION_TYPES.LIST,
)

export function getArtifactList<S extends ReduxState>(
  apiURL: URL,
  register: PiRegister,
): (props: PropT<LoadArtifactListEvent>) => PromiseT<S, ArtifactListEvent> {
  return (props: PropT<LoadArtifactListEvent>) => {
    const reqID = uuidv4()
    dispatchIvcapGetArtifactList(
      { apiURL: apiURL.toString(), reqID, ...props },
      register.reducer.dispatchFromReducer,
    )
    return getPromise<S, ArtifactListEvent>(ACTION_TYPES.LIST, register, reqID)
  }
}


//type History = Cursor[]
// const Page2Prev: { [k: Cursor]: Cursor } = {}

//====== API HANDLER

export function init(register: PiRegister): void {
  register.GET<ReduxState, ReduxAction & LoadArtifactListEvent, any, OAuthContextT>({
    ...CommonProps("loadArtifactList"),
    url: createListUrlBuilder("artifacts"),
    request: (a, _) => ({ ...a, page: removePageOffset(a) } as any),
    trigger: ACTION_TYPES.LOAD_LIST,
    // headers: (_1, _2, ctxt) => ({ Authorization: `Bearer ${ctxt.token}` }),
    reply: (state, content: any, dispatch, { request }) => {
      const artifacts = (content.items || []).map(toArtifactListItem)
      const offset = getOffsetFromPage(request.page)
      const nextPage = addOffsetFromPage(offset + artifacts.length, getNextPage(content.links))
      const ev: ArtifactListEvent = {
        artifacts,
        offset,
        nextPage,
        prevPage: request.page,
      }
      dispatchEvent(ev, ACTION_TYPES.LIST, dispatch, request)
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

function toArtifactListItem(els: any): ArtifactListItem {
  // {
  //   id: 'urn:ivcap:artifact:cbcc1748-1a45-4369-85ee-e631b99676c4',
  //   name: 'tmppsmdglsm-1154x866.pseudo.png',
  //   status: 'ready'
  // }
  return {
    id: els.id,
    status: els.status,
    mimeType: els["mime-type"],
    name: els.name,
    size: els.size,
    href: els.href
  }
}
