import {
  PiRegister,
  ReduxState,
  ReduxAction,
  createOnAction,
  DispatchF,
  ReduceF,
} from "@pihanga2/core"
import { URN } from ".."
import { createReadAction, LoadRecordEvent } from "../actions"
import {
  dispatchEvent,
  PropT,
  RequestEvent,
  CommonProps,
  makeAPI,
} from "../common"
import { SERVICE_ACTION } from "./service.actions"

export type ServiceRecordEvent = RequestEvent & {
  service: ServiceRecord
}

export type ServiceRecord = {
  id: string;
  name: string;
  description: string;
  parameters: ServiceParameter[];
  account: URN;
};

export enum ParameterType {
  String = "string",
  Int = "int",
  Float = "float",
  Bool = "bool",
  Option = "option",
  Artifact = "artifact",
  Unknown = "unknown",
}

export type ServiceParameter = {
  name: string;
  label?: string;
  type: ParameterType;
  description: string;
  unit?: string;
  isConstant: boolean;
  isOptional: boolean;
  defaultValue?: any;
  options?: ServiceParameterOption[];
};

export type ServiceParameterOption = {
  value: any;
  description?: string;
};

export type LoadServiceRecordEvent = LoadRecordEvent<ServiceRecordEvent>

export function dispatchIvcapGetServiceRecord(
  ev: LoadServiceRecordEvent,
  dispatch: DispatchF,
): void {
  const a = createReadAction(SERVICE_ACTION.LOAD_RECORD, ev)
  dispatch(a)
}

export const onServiceRecord = createOnAction<ServiceRecordEvent>(
  SERVICE_ACTION.RECORD,
)

export function getServiceRecord<S extends ReduxState>(
  register: PiRegister,
): (props: PropT<LoadServiceRecordEvent>, reducerF: ReduceF<S, ReduxAction & ServiceRecordEvent>) => void {
  return makeAPI<S, LoadServiceRecordEvent, ServiceRecordEvent>(
    register, SERVICE_ACTION.RECORD, dispatchIvcapGetServiceRecord
  )
  // return (props: PropT<LoadServiceRecordEvent>) => {
  //   const reqID = uuidv4()
  //   dispatchIvcapGetServiceRecord(
  //     { apiURL: apiURL.toString(), reqID, ...props },
  //     register.reducer.dispatchFromReducer,
  //   )
  //   return getPromise<S, ServiceRecordEvent>(
  //     SERVICE_ACTION.RECORD,
  //     register,
  //     reqID,
  //   )
  // }
}

//====== API HANDLER

export function getInit(register: PiRegister): void {
  register.GET<ReduxState, ReduxAction & LoadServiceRecordEvent, any>({
    ...CommonProps("getServiceR"),
    url: "/1/services/:id",
    trigger: SERVICE_ACTION.LOAD_RECORD,
    request: ({ id }, _) => ({ id }),
    reply: (state, content: any, dispatch, { request }) => {
      const ev: ServiceRecordEvent = {
        service: toServiceRecord(content),
      }
      dispatchEvent(ev, SERVICE_ACTION.RECORD, dispatch, request)
      return state
    },
  })
}

function toServiceRecord(el: any): ServiceRecord {
  // {
  //   id: 'urn:ivcap:service:8773f79e-d46c-559a-a63c-54c4e2a9d9a1',
  //   name: 'infer-with-paddle-paddle',
  //   description: 'A service which applies a PaddlePaddle model to a set of images',
  //   parameters: [

  //   ],
  //   provider: {
  //     id: 'urn:ivcap:provider:4c65b865-df6a-4977-982a-f96b19c1fda0'
  //   },
  //   account: {
  //     id: 'urn:ivcap:account:4c65b865-df6a-4977-982a-f96b19c1fda0'
  //   },
  //   links: {
  //     self: 'https://develop.ivcap.net/1/services/8773f79e-d46c-559a-a63c-54c4e2a9d9a1'
  //   }
  // },

  return {
    id: el.id,
    name: el.name,
    description: el.description,
    parameters: toParameterList(el.parameters),
    account: el.account?.id,
  };
}

function toParameterList(parameters: any[] = []): ServiceParameter[] {
  //   {
  //     name: 'device',
  //     label: '',
  //     type: 'option',
  //     description: 'Select which device to inference, defaults to gpu.',
  //     unit: '',
  //     constant: false
  //     optional: false,
  //     'default': 'cpu',
  //     options: [
  //       {
  //         value: 'cpu',
  //         description: ''
  //       },
  //       {
  //         value: 'gpu',
  //         description: ''
  //       }
  //     ]
  //   },
  return parameters.map(
    (el) =>
    ({
      name: el.name,
      label: el.label,
      type: toParameterType(el.type),
      description: el.name,
      unit: el.name,
      isConstant: !!el.constant,
      isOptional: !!el.optional,
      defaultValue: el["default"],
      options: toOptions(el.options),
    } as ServiceParameter)
  );
}

function toParameterType(el: string | undefined): ParameterType {
  var pt;
  if (el) {
    pt = enumFromStringValue(ParameterType, el);
    if (!pt) pt = ParameterType.Unknown;
  } else {
    pt = ParameterType.String;
  }
  return pt;
}

function toOptions(els: any[] = []): ServiceParameterOption[] {
  return els.map(
    (el) =>
    ({
      value: el.value,
      description: el.description,
    } as ServiceParameterOption)
  );
}

// https://stackoverflow.com/a/41548441/3528225
function enumFromStringValue<T>(
  enm: { [s: string]: T },
  value: string
): T | undefined {
  return (Object.values(enm) as unknown as string[]).includes(value)
    ? (value as unknown as T)
    : undefined;
}
