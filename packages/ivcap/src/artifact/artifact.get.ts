import { v4 as uuidv4 } from "uuid"
import {
  PiRegister,
  ReduxState,
  ReduxAction,
  createOnAction,
  DispatchF,
} from "@pihanga/core"
import { getAccessToken } from ".."
import { createReadAction, LoadRecordEvent } from "../actions"
import {
  restErrorHandling,
  dispatchEvent,
  PromiseT,
  PropT,
  getPromise,
  RequestEvent,
} from "../common"
import { ACTION_TYPES } from "./artifact.actions"

export type ArtifactRecordEvent = RequestEvent & {
  artifact: ArtifactRecord
}

export type ArtifactRecord = {
  id: string
  name: string
  status: string
  mimeType: string
  size: number
  dataURL: string
  accountID: string
}

export type LoadArtifactRecordEvent = LoadRecordEvent<ArtifactRecordEvent>

export function dispatchIvcapGetArtifactRecord(
  ev: LoadArtifactRecordEvent,
  dispatch: DispatchF,
): void {
  const a = createReadAction(ACTION_TYPES.LOAD_RECORD, ev)
  dispatch(a)
}

export const onArtifactRecord = createOnAction<ArtifactRecordEvent>(
  ACTION_TYPES.RECORD,
)

export function getArtifactRecord<S extends ReduxState>(
  apiURL: URL,
  register: PiRegister,
): (props: PropT<LoadArtifactRecordEvent>) => PromiseT<S, ArtifactRecordEvent> {
  return (props: PropT<LoadArtifactRecordEvent>) => {
    const reqID = uuidv4()
    dispatchIvcapGetArtifactRecord(
      { apiURL: apiURL.toString(), reqID, ...props },
      register.reducer.dispatchFromReducer,
    )
    return getPromise<S, ArtifactRecordEvent>(
      ACTION_TYPES.RECORD,
      register,
      reqID,
    )
  }
}

//====== API HANDLER

export function init(register: PiRegister): void {
  register.GET<ReduxState, ReduxAction & LoadArtifactRecordEvent, any>({
    name: "getArtifactRecord",
    origin: ({ apiURL }, _) => apiURL,
    url: "/1/artifacts/:id",
    trigger: ACTION_TYPES.LOAD_RECORD,
    request: ({ id }, _) => ({ id }),
    headers: () => ({ Authorization: `Bearer ${getAccessToken()}` }),
    reply: (state, content: any, dispatch, { request }) => {
      const ev: ArtifactRecordEvent = {
        artifact: toArtifactRecord(content),
      }
      dispatchEvent(ev, ACTION_TYPES.RECORD, dispatch, request)
      return state
    },
    error: restErrorHandling("ivcap-api:getArtifactRecord"),
  })
}

function toArtifactRecord(els: any): ArtifactRecord {
  // id: 'urn:ivcap:artifact:76fc1192-0eae-469a-b3a5-bda29f4924ce',
  // name: 'tmp4kjnvxl9-1154x866.pseudo.png',
  // data: {
  //   self: 'https://develop.ivcap.net/1/artifacts/76fc1192-0eae-469a-b3a5-bda29f4924ce/blob'
  // },
  // status: 'ready',
  // 'mime-type': 'image/jpeg',
  // size: 18317,
  // account: {
  //   id: 'urn:ivcap:account:4c65b865-df6a-4977-982a-f96b19c1fda0'
  // }
  return {
    id: els.id,
    name: els.name,
    status: els.status,
    mimeType: els["mime-type"],
    size: els.size,
    dataURL: els.data?.self,
    accountID: els.account?.id,
  }
}
