import {
  PiRegister,
  ReduxState,
  ReduxAction, RestContentType,
  createOnAction,
  DispatchF,
  ReduceF,
} from "@pihanga2/core"
import { BaseEvent, createReadAction } from "../actions"
import {
  dispatchEvent,
  PropT,
  RequestEvent,
  CommonProps,
  makeAPI,
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
  register: PiRegister,
): (props: PropT<LoadArtifactDataEvent>, reducerF: ReduceF<S, ReduxAction & ArtifactDataEvent>) => void {
  return makeAPI<S, LoadArtifactDataEvent, ArtifactDataEvent>(
    register, ACTION_TYPES.DATA, dispatchIvcapGetArtifactData
  )
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
