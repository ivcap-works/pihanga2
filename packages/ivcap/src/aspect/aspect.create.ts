import {
  PiRegister,
  ReduxState,
  ReduxAction,
  createOnAction,
  DispatchF,
  ReduceF,
} from "@pihanga2/core"
import { URN } from ".."
import { BaseEvent } from "../actions"
import {
  dispatchEvent,
  PropT,
  RequestEvent,
  CommonProps,
  makeAPI,
} from "../common"
import { ASPECT_ACTION } from "./aspect.actions"

export type CreateAspectEvent<C = any> = BaseEvent<AspectCreatedEvent> & {
  refID?: string // for internal reference
  entity: URN
  schema: URN
  content: C
  contentType: string
}

export type AspectCreatedEvent = RequestEvent & {
  refID?: string
  aspectID: URN
}

export function dispatchIvcapCreateAspect(
  ev: CreateAspectEvent,
  dispatch: DispatchF,
): void {
  const a = { type: ASPECT_ACTION.CREATE, ...ev }
  dispatch(a)
}

export const onAspectUploaded = createOnAction<AspectCreatedEvent>(
  ASPECT_ACTION.CREATE,
)

export type CreateAspectR<S extends ReduxState> = ReduceF<
  S,
  ReduxAction & AspectCreatedEvent
>
export function createAspect<S extends ReduxState, C = any>(
  register: PiRegister,
): (
  props: PropT<CreateAspectEvent<C>>,
  reducerF: CreateAspectR<S> | null,
) => void {
  return makeAPI<S, CreateAspectEvent, AspectCreatedEvent>(
    register,
    ASPECT_ACTION.CREATED,
    dispatchIvcapCreateAspect,
  )
}

//====== API HANDLER

export function createInit(register: PiRegister): void {
  register.POST<ReduxState, ReduxAction & CreateAspectEvent, any>({
    ...CommonProps("createAspect"),
    url: "/1/aspects?entity=:entity&schema=:schema",
    trigger: ASPECT_ACTION.CREATE,
    request: ({ entity, schema, content, contentType }) => {
      return {
        bindings: { entity, schema },
        body: content,
        contentType,
      }
    },
    reply: (state, reply: any, dispatch, { request }) => {
      const ev: AspectCreatedEvent = {
        refID: request.refID,
        aspectID: reply.id,
      }
      dispatchEvent(ev, ASPECT_ACTION.CREATED, dispatch, request)
      return state
    },
  })
}
