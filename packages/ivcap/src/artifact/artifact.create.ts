import { v4 as uuidv4 } from "uuid"
import {
  PiRegister,
  ReduxState,
  ReduxAction,
  createOnAction,
  DispatchF,
} from "@pihanga/core"
import { URN, getAccessToken } from ".."
import { BaseEvent } from "../actions"
import {
  restErrorHandling,
  dispatchEvent,
  PromiseT,
  PropT,
  getPromise,
  RequestEvent,
} from "../common"
import { ACTION_TYPES } from "./artifact.actions"

export type CreateArtifactEvent = BaseEvent<ArtifactCreatedEvent> & {
  file: File
  name?: string // if not set, use file.name
  chunkSize?: number
  refID?: string
}

export type ArtifactCreatedEvent = RequestEvent & {
  name: string
  artifactURN: URN
  size: number
  contentType: string
  refID?: string
}

export function dispatchIvcapCreateArtifact(
  ev: CreateArtifactEvent,
  dispatch: DispatchF,
): void {
  const a = { type: ACTION_TYPES.UPLOAD_DATA, ...ev }
  dispatch(a)
}

export const onArtifactUploaded = createOnAction<ArtifactCreatedEvent>(
  ACTION_TYPES.UPLOADED_RECORD,
)

export function createArtifact<S extends ReduxState>(
  apiURL: URL,
  register: PiRegister,
): (props: PropT<CreateArtifactEvent>) => PromiseT<S, ArtifactCreatedEvent> {
  return (props: PropT<CreateArtifactEvent>) => {
    const reqID = uuidv4()
    dispatchIvcapCreateArtifact(
      { apiURL: apiURL.toString(), reqID, ...props },
      register.reducer.dispatchFromReducer,
    )
    return getPromise<S, ArtifactCreatedEvent>(
      ACTION_TYPES.UPLOADED_RECORD,
      register,
      reqID,
    )
  }
}

// PARTIAL

export type ArtifactPartialUploadEvent =
  BaseEvent<ArtifactUploadProgressEvent> & {
    name: string
    artifactURN: URN
    refID?: string
    content: ArrayBuffer
    contentType: string
    offset: number
    size: number
    chunkSize: number
    timeStamp: number
  }

export type ArtifactUploadProgressEvent = {
  name: string
  artifactURN: URN
  refID?: string
  progress: number // percent
  uploadRate: number // byes/sec
}

export const onArtifactUploadProgress =
  createOnAction<ArtifactUploadProgressEvent>(ACTION_TYPES.UPLOAD_PROGRESS)

//====== API HANDLER

export function init(register: PiRegister): void {
  register.POST<ReduxState, ReduxAction & CreateArtifactEvent, any>({
    name: "createArtifact",
    origin: ({ apiURL }, _) => apiURL,
    url: "/1/artifacts",
    trigger: ACTION_TYPES.UPLOAD_DATA,
    request: ({ file }) => {
      return {
        body: "",
        contentType: file.type,
      }
    },
    headers: ({ name, file }) => ({
      Authorization: `Bearer ${getAccessToken()}`,
      "X-Content-Length": `${file.size}`,
      "X-Content-Type": `${file.type}`,
      "Upload-Length": `${file.size}`,
      "X-Name": btoa(name || file.name),
    }),
    reply: (state, reply: any, dispatch, { request }) => {
      const reader = new FileReader()
      reader.readAsArrayBuffer(request.file)
      reader.onload = (): void => {
        const content = reader.result
        const size = request.file.size
        let chunkSize: number
        if (request.chunkSize) {
          chunkSize = request.chunkSize
        } else {
          chunkSize = Math.min(size / 5, 4000000)
          chunkSize = Math.trunc(Math.max(chunkSize, 2000000))
        }
        // kick off tjhe actual uploading
        const evb: ArtifactPartialUploadEvent = {
          name: request.name || request.file.name,
          apiURL: request.apiURL,
          artifactURN: reply["id"],
          content: content as ArrayBuffer,
          contentType: request.file.type,
          refID: request.refID,
          offset: 0,
          size,
          chunkSize,
          timeStamp: Date.now(),
        }
        dispatchEvent(evb, ACTION_TYPES.UPLOAD_PARTIAL, dispatch, request)
      }
      reader.onerror = (): void => {
        restErrorHandling("ivcap-api:loadFile")
      }
      return state
    },
    error: restErrorHandling("ivcap-api:createArtifact"),
  })

  register.PATCH<ReduxState, ReduxAction & ArtifactPartialUploadEvent, any>({
    name: "uploadArtifactPartial",
    origin: ({ apiURL }, _) => apiURL,
    url: "/1/artifacts/:id/blob",
    trigger: ACTION_TYPES.UPLOAD_PARTIAL,
    request: ({ artifactURN, content, offset, chunkSize, contentType }) => {
      const body = content.slice(offset, offset + chunkSize)
      return {
        bindings: { id: artifactURN },
        body,
        contentType,
      }
    },
    headers: ({ offset, chunkSize, size }) => {
      const l = Math.min(chunkSize, size - offset)
      return {
        Authorization: `Bearer ${getAccessToken()}`,
        "Content-Type": "application/offset+octet-stream",
        "Content-Length": `${l}`,
        "Upload-Length": `${size}`,
        "Upload-Offset": `${offset}`,
        "Tus-Resumable": "1.0.0",
      }
    },
    reply: (state, _, dispatch, { request }) => {
      const offset = Math.min(request.offset + request.chunkSize, request.size)
      if (offset >= request.size) {
        // we are done
        const evd: ArtifactCreatedEvent = {
          name: request.name,
          artifactURN: request.artifactURN,
          size: request.size,
          contentType: request.contentType,
          refID: request.refID,
        }
        dispatchEvent(evd, ACTION_TYPES.UPLOADED_RECORD, dispatch, request)
      } else {
        const now = Date.now()
        dispatch<ReduxAction & ArtifactPartialUploadEvent>({
          ...request,
          offset,
          timeStamp: now,
        })
        const uploadRate =
          (1000 * (offset - request.offset)) / (now - request.timeStamp)
        const progress = (1.0 * offset) / request.size
        dispatch<ReduxAction & ArtifactUploadProgressEvent>({
          type: ACTION_TYPES.UPLOAD_PROGRESS,
          name: request.name,
          artifactURN: request.artifactURN,
          refID: request.refID,
          progress,
          uploadRate,
        })
      }
      return state
    },
    error: restErrorHandling("ivcap-api:uploadArtifactPartial"),
  })
}
