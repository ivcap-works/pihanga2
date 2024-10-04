import {
  PiRegister,
  ReduxState,
  ReduxAction,
  createOnAction,
  DispatchF,
  ReduceF,
} from "@pihanga2/core"
import { createListAction, ListEvent, LoadListEvent } from "../actions"
import {
  createListUrlBuilder,
  dispatchEvent,
  PropT,
  CommonProps,
  getPageLinks,
  PageLinks,
  makeAPI,
} from "../common"
import { ACTION_TYPES } from "./artifact.actions"
import { OAuthContextT } from "../auth/common"

export type Cursor = string

export type ArtifactListEvent = ListEvent & PageLinks & {
  artifacts: ArtifactListItem[]
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

// export function getArtifactList<S extends ReduxState>(
//   apiURL: URL,
//   register: PiRegister,
// ): (props: PropT<LoadArtifactListEvent>) => PromiseT<S, ArtifactListEvent> {
//   return (props: PropT<LoadArtifactListEvent>) => {
//     const reqID = uuidv4()
//     dispatchIvcapGetArtifactList(
//       { apiURL: apiURL.toString(), reqID, ...props },
//       register.reducer.dispatchFromReducer,
//     )
//     return getPromise<S, ArtifactListEvent>(ACTION_TYPES.LIST, register, reqID)
//   }
// }

export function getArtifactList<S extends ReduxState>(
  register: PiRegister,
): (props: PropT<LoadArtifactListEvent>, reducerF: ReduceF<S, ReduxAction & ArtifactListEvent>) => void {
  return makeAPI<S, LoadArtifactListEvent, ArtifactListEvent>(
    register, ACTION_TYPES.LIST, dispatchIvcapGetArtifactList
  )

  // return (props: PropT<LoadArtifactListEvent>, reducerF: ReduceF<S, ReduxAction & ArtifactListEvent>) => {
  //   GetOAuthContext().then(({ ivcapURL }) => {
  //     const apiURL = new URL(ivcapURL)
  //     const reqID = uuidv4()
  //     dispatchIvcapGetArtifactList(
  //       { apiURL: apiURL.toString(), reqID, ...props },
  //       register.reducer.dispatchFromReducer,
  //     )
  //     resultHandler<S, ArtifactListEvent>(ACTION_TYPES.LIST, register, reqID, reducerF)
  //   })
  // }
}


//type History = Cursor[]
// const Page2Prev: { [k: Cursor]: Cursor } = {}

//====== API HANDLER

export function init(register: PiRegister): void {
  register.GET<ReduxState, ReduxAction & LoadArtifactListEvent, any, OAuthContextT>({
    ...CommonProps("loadArtifactList"),
    url: createListUrlBuilder("artifacts"),
    request: (a, _) => {
      const b = { ...a, page: removePageOffset(a) } as any
      if (b.orderBy === "mimeType") {
        b.orderBy = "mime-type"
      }
      return b
    },
    trigger: ACTION_TYPES.LOAD_LIST,
    // headers: (_1, _2, ctxt) => ({ Authorization: `Bearer ${ctxt.token}` }),
    reply: (state, content: any, dispatch, { request }) => {
      const artifacts = (content.items || []).map(toArtifactListItem)
      const ev: ArtifactListEvent = {
        artifacts,
        ...getPageLinks(content.links),
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

// function getOffsetFromPage(page?: string): number {
//   return page ? Number(page.split(":")[1]) : 0
// }

// function addOffsetFromPage(offset: number, page?: string): string | undefined {
//   return page ? `${page}:${offset}` : undefined
// }

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
