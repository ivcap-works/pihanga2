import {
  createOnAction,
  ReduxAction,
  registerActions,
} from "@pihanga/core"

export const ACTION_TYPES = registerActions("ivcap", [
  "INIT",
  "ERROR",
  "NOT_AUTHORIZED",
])

export type BaseEvent<T = {}> = {
  apiURL: string
  mapper?: (a: T) => ReduxAction
  reqID?: string // uuid
}

// LOAD LIST

export const DEF_LIST_LIMIT = 15

export type LoadListProps = {
  limit?: number
  page?: string
  filter?: string // "name ~= 'Scott%'"
  orderBy?: string //
  orderDesc?: boolean // set to true if return list in descending order
  atTime?: Date // return result as of
}

export type LoadListEvent<T = {}> = BaseEvent<T> & LoadListProps

export type ListEvent = {
  nextPage?: string
  reqID?: string // uuid
}

export function createListAction<T>(
  type: string,
  ev: LoadListEvent<T>,
): ReduxAction & LoadListEvent<T> {
  return {
    type,
    ...ev,
    limit: ev.limit || DEF_LIST_LIMIT,
  }
}

// LOAD SINGLE RECORD

export type LoadRecordEvent<T = {}> = BaseEvent<T> & {
  id: string
}

export function createReadAction<T>(
  type: string,
  ev: LoadRecordEvent<T>,
): ReduxAction & LoadRecordEvent<T> {
  return {
    type,
    ...ev,
  }
}

// ERROR

export type ErrorAction = ReduxAction & {
  message: string
  source: string
  cause: any
  requestAction: ReduxAction
}

export const onIvcapError = createOnAction<ErrorAction>(ACTION_TYPES.ERROR)
export const onIvcapUnauthorizedError = createOnAction<ErrorAction>(
  ACTION_TYPES.NOT_AUTHORIZED,
)
