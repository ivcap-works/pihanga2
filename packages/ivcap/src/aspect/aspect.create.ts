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

export type CreateAspectEvent = BaseEvent<AspectCreatedEvent> & {
  refID: string; // for internal reference
  entity: URN
  schema: URN
  content: any
  contentType: string
}

export type AspectCreatedEvent = RequestEvent & {
  refID: string,
  aspectID: URN,
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

export function createAspect<S extends ReduxState>(
  register: PiRegister,
): (props: PropT<CreateAspectEvent>, reducerF: ReduceF<S, ReduxAction & AspectCreatedEvent>) => void {
  return makeAPI<S, CreateAspectEvent, AspectCreatedEvent>(
    register, ASPECT_ACTION.CREATED, dispatchIvcapCreateAspect
  )
  // return (props: PropT<CreateAspectEvent>) => {
  //   const reqID = uuidv4()
  //   dispatchIvcapCreateAspect(
  //     { apiURL: apiURL.toString(), reqID, ...props },
  //     register.reducer.dispatchFromReducer,
  //   )
  //   return getPromise<S, AspectCreatedEvent>(
  //     ASPECT_ACTION.CREATED,
  //     register,
  //     reqID,
  //   )
  // }
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
      };
      dispatchEvent(ev, ASPECT_ACTION.CREATED, dispatch, request);
      return state
    },
  })
}
