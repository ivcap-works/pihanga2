import { v4 as uuidv4 } from "uuid"
import {
  PiRegister,
  ReduxState,
  ReduxAction,
  createOnAction,
  DispatchF,
} from "@pihanga/core"
import { getAccessToken } from ".."
import { BaseEvent, createReadAction } from "../actions"
import {
  restErrorHandling,
  dispatchEvent,
  PromiseT,
  PropT,
  getPromise,
  RequestEvent,
} from "../common"
import { ACTION_TYPES } from "./artifact.actions"

export type ArtifactDataEvent = RequestEvent & {
  artifactID: string
  data: Blob | any
  size: number
  mimeType: string
}

export type LoadArtifactDataEvent = BaseEvent<ArtifactDataEvent> & {
  id: string
  dataURL: string
}

export function dispatchIvcapGetArtifactData(
  ev: LoadArtifactDataEvent,
  dispatch: DispatchF,
): void {
  const a = createReadAction(ACTION_TYPES.LOAD_DATA, ev)
  dispatch(a)
}

export const onArtifactData = createOnAction<ArtifactDataEvent>(
  ACTION_TYPES.DATA,
)

export function getArtifactData<S extends ReduxState>(
  apiURL: URL,
  register: PiRegister,
): (props: PropT<LoadArtifactDataEvent>) => PromiseT<S, ArtifactDataEvent> {
  return (props: PropT<LoadArtifactDataEvent>) => {
    const reqID = uuidv4()
    dispatchIvcapGetArtifactData(
      { apiURL: apiURL.toString(), reqID, ...props },
      register.reducer.dispatchFromReducer,
    )
    return getPromise<S, ArtifactDataEvent>(ACTION_TYPES.DATA, register, reqID)
  }
}

export function init(register: PiRegister): void {
  register.GET<ReduxState, ReduxAction & LoadArtifactDataEvent, any>({
    name: "getArtifactData",
    origin: ({ dataURL }, _) => new URL(dataURL).origin,
    url: "/1/artifacts/:id/blob",
    trigger: ACTION_TYPES.LOAD_DATA,
    request: (a, _) => {
      const id = a.id.split(":")[3]
      return { id }
    },
    headers: () => ({ Authorization: `Bearer ${getAccessToken()}` }),
    reply: (state, content: any, dispatch, { request, contentType }) => {
      const blob = content as Blob
      const evb: ArtifactDataEvent = {
        artifactID: request.id,
        data: blob,
        mimeType: contentType,
        size: blob.size,
      }
      dispatchEvent(evb, ACTION_TYPES.DATA, dispatch, request)
      return state
    },
    error: restErrorHandling("ivcap-api:getArtifactData"),
  })
}
