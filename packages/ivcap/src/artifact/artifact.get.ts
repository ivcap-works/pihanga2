import {
  PiRegister,
  ReduxState,
  ReduxAction,
  createOnAction,
  DispatchF,
  ReduceF,
} from "@pihanga2/core"
import { createReadAction, LoadRecordEvent } from "../actions"
import {
  dispatchEvent,
  PropT,
  RequestEvent,
  CommonProps,
  makeAPI,
} from "../common"
import { ACTION_TYPES } from "./artifact.actions"

export type ArtifactRecordEvent = RequestEvent & {
  artifact: ArtifactRecord
}

// id: 'urn:ivcap:artifact:bafdd6ed-e74c-4b82-b1a6-80c0a777ec0e',
// name: 'http://artifact.local/urn:ivcap:artifact:1f8c8c66-2ea6-4f95-a7c2-9b7e7bf91e30.png',
// status: 'ready',
// 'mime-type': 'image/png',
// size: 16388,
// etag: '',
// 'created-at': '2023-11-08T06:59:16Z',
// 'last-modified-at': '2023-11-08T06:59:16Z',
// policy: 'urn:ivcap:policy:ivcap.base.artifact',
// account: 'urn:ivcap:account:45a06508-5c3a-4678-8e6d-e6399bf27538',
// dataRef: 'https://develop.ivcap.net/1/artifacts/bafdd6ed-e74c-4b82-b1a6-80c0a777ec0e/blob',

export type ArtifactRecord = {
  id: string
  name: string
  status: string
  mimeType: string
  size: number
  createdAt: string
  lastModifiedAt: string
  dataURL: string
  policy: string
  account: string
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
  register: PiRegister,
): (props: PropT<LoadArtifactRecordEvent>, reducerF: ReduceF<S, ReduxAction & ArtifactRecordEvent>) => void {
  return makeAPI<S, LoadArtifactRecordEvent, ArtifactRecordEvent>(
    register, ACTION_TYPES.RECORD, dispatchIvcapGetArtifactRecord
  )

  // return (props: PropT<LoadArtifactRecordEvent>) => {
  //   const reqID = uuidv4()
  //   dispatchIvcapGetArtifactRecord(
  //     { apiURL: apiURL.toString(), reqID, ...props },
  //     register.reducer.dispatchFromReducer,
  //   )
  //   return getPromise<S, ArtifactRecordEvent>(
  //     ACTION_TYPES.RECORD,
  //     register,
  //     reqID,
  //   )
  // }
}

//====== API HANDLER

export function init(register: PiRegister): void {
  register.GET<ReduxState, ReduxAction & LoadArtifactRecordEvent, any>({
    ...CommonProps("getArtifactRecord"),
    url: "/1/artifacts/:id",
    trigger: ACTION_TYPES.LOAD_RECORD,
    request: ({ id }, _) => ({ id }),
    reply: (state, content: any, dispatch, { request }) => {
      const ev: ArtifactRecordEvent = {
        artifact: toArtifactRecord(content),
      }
      dispatchEvent(ev, ACTION_TYPES.RECORD, dispatch, request)
      return state
    },
  })
}

function toArtifactRecord(els: any): ArtifactRecord {
  // id: 'urn:ivcap:artifact:bafdd6ed-e74c-4b82-b1a6-80c0a777ec0e',
  // name: 'http://artifact.local/urn:ivcap:artifact:1f8c8c66-2ea6-4f95-a7c2-9b7e7bf91e30.png',
  // status: 'ready',
  // 'mime-type': 'image/png',
  // size: 16388,
  // etag: '',
  // 'created-at': '2023-11-08T06:59:16Z',
  // 'last-modified-at': '2023-11-08T06:59:16Z',
  // policy: 'urn:ivcap:policy:ivcap.base.artifact',
  // account: 'urn:ivcap:account:45a06508-5c3a-4678-8e6d-e6399bf27538',
  // dataRef: 'https://develop.ivcap.net/1/artifacts/bafdd6ed-e74c-4b82-b1a6-80c0a777ec0e/blob',
  return {
    id: els.id,
    name: els.name,
    status: els.status,
    mimeType: els["mime-type"],
    size: els.size,
    createdAt: els["created-at"],
    lastModifiedAt: els["last-modified-at"],
    dataURL: els.dataRef,
    policy: els.policy,
    account: els.account,
  }
}
