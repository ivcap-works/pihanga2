import { v4 as uuidv4 } from "uuid"
import {
  PiRegister,
  ReduxState,
  ReduxAction, RestContentType,
  createOnAction,
  DispatchF,
} from "@pihanga2/core"
import { getAccessToken } from ".."
import { BaseEvent, createReadAction } from "../actions"
import {
  restErrorHandling,
  dispatchEvent,
  PromiseT,
  PropT,
  getPromise,
  RequestEvent,
  CommonProps,
} from "../common"
import { ACTION_TYPES } from "./artifact.actions"


export type ArtifactDataEvent = RequestEvent & {
  artifactID: string
  dataType: RestContentType
  data: any
  size: number
  mimeType: string
}

export type LoadArtifactDataEvent = BaseEvent<ArtifactDataEvent> & {
  id: string
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
    ...CommonProps("getArtifactData"),
    url: "/1/artifacts/:id/blob",
    trigger: ACTION_TYPES.LOAD_DATA,
    request: (a, _) => {
      const pa = a.id.split(":")
      const id = pa.length === 4 ? pa[3] : pa[0]
      return { id }
    },
    reply: (state, content: any, dispatch, { request, contentType, mimeType, size }) => {
      var data = content
      if (contentType === RestContentType.Blob) {
        data = URL.createObjectURL(content)
      }
      const evb: ArtifactDataEvent = {
        artifactID: request.id,
        dataType: contentType,
        data,
        mimeType,
        size,
      }
      dispatchEvent(evb, ACTION_TYPES.DATA, dispatch, request)
      return state
    },
  })
}
