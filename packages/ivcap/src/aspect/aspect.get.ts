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
  PromiseT, PropT,
  getPromise,
  RequestEvent,
} from "../common"
import { ASPECT_ACTION } from "./aspect.actions"

export type AspectRecordEvent = RequestEvent & {
  aspect: AspectRecord
}

// id: 'urn:ivcap:aspect:bafdd6ed-e74c-4b82-b1a6-80c0a777ec0e',
// name: 'http://aspect.local/urn:ivcap:aspect:1f8c8c66-2ea6-4f95-a7c2-9b7e7bf91e30.png',
// status: 'ready',
// 'mime-type': 'image/png',
// size: 16388,
// etag: '',
// 'created-at': '2023-11-08T06:59:16Z',
// 'last-modified-at': '2023-11-08T06:59:16Z',
// policy: 'urn:ivcap:policy:ivcap.base.aspect',
// account: 'urn:ivcap:account:45a06508-5c3a-4678-8e6d-e6399bf27538',
// dataRef: 'https://develop.ivcap.net/1/aspects/bafdd6ed-e74c-4b82-b1a6-80c0a777ec0e/blob',

export type AspectRecord = {
  id: string
  name: string
  status: string
  mimeType: string
  size: number
  createdAt: number // UNIX time in msec
  lastModifiedAt: number // UNIX time in msec
  dataURL: string
  policy: string
  account: string
}

export type LoadAspectRecordEvent = LoadRecordEvent<AspectRecordEvent>

export function dispatchIvcapGetAspectRecord(
  ev: LoadAspectRecordEvent,
  dispatch: DispatchF,
): void {
  const a = createReadAction(ASPECT_ACTION.LOAD_RECORD, ev)
  dispatch(a)
}

export const onAspectRecord = createOnAction<AspectRecordEvent>(
  ASPECT_ACTION.RECORD,
)

export function getAspectRecord<S extends ReduxState>(
  apiURL: URL,
  register: PiRegister,
): (props: PropT<LoadAspectRecordEvent>) => PromiseT<S, AspectRecordEvent> {
  return (props: PropT<LoadAspectRecordEvent>) => {
    const reqID = uuidv4()
    dispatchIvcapGetAspectRecord(
      { apiURL: apiURL.toString(), reqID, ...props },
      register.reducer.dispatchFromReducer,
    )
    return getPromise<S, AspectRecordEvent>(
      ASPECT_ACTION.RECORD,
      register,
      reqID,
    )
  }
}

//====== API HANDLER

export function getInit(register: PiRegister): void {
  register.GET<ReduxState, ReduxAction & LoadAspectRecordEvent, any>({
    name: "getAspectRecord",
    origin: ({ apiURL }, _) => apiURL,
    url: "/1/aspects/:id",
    trigger: ASPECT_ACTION.LOAD_RECORD,
    request: ({ id }, _) => ({ id }),
    headers: () => ({ Authorization: `Bearer ${getAccessToken()}` }),
    reply: (state, content: any, dispatch, { request }) => {
      const ev: AspectRecordEvent = {
        aspect: toAspectRecord(content),
      }
      dispatchEvent(ev, ASPECT_ACTION.RECORD, dispatch, request)
      return state
    },
    error: restErrorHandling("ivcap-api:getAspectRecord"),
  })
}

function toAspectRecord(els: any): AspectRecord {
  // id: 'urn:ivcap:aspect:bafdd6ed-e74c-4b82-b1a6-80c0a777ec0e',
  // name: 'http://aspect.local/urn:ivcap:aspect:1f8c8c66-2ea6-4f95-a7c2-9b7e7bf91e30.png',
  // status: 'ready',
  // 'mime-type': 'image/png',
  // size: 16388,
  // etag: '',
  // 'created-at': '2023-11-08T06:59:16Z',
  // 'last-modified-at': '2023-11-08T06:59:16Z',
  // policy: 'urn:ivcap:policy:ivcap.base.aspect',
  // account: 'urn:ivcap:account:45a06508-5c3a-4678-8e6d-e6399bf27538',
  // dataRef: 'https://develop.ivcap.net/1/aspects/bafdd6ed-e74c-4b82-b1a6-80c0a777ec0e/blob',
  return {
    id: els.id,
    name: els.name,
    status: els.status,
    mimeType: els["mime-type"],
    size: els.size,
    createdAt: Date.parse(els["created-at"]),
    lastModifiedAt: Date.parse(els["last-modified-at"]),
    dataURL: els.dataRef,
    policy: els.policy,
    account: els.account,
  }
}
