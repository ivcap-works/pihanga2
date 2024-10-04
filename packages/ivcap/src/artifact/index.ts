import { PropT } from "../common"
import { ReduxState, PiRegister, ReduxAction, ReduceF } from "@pihanga2/core"
import {
  LoadArtifactDataEvent,
  ArtifactDataEvent,
  getArtifactData,
  init as dataInit,
} from "./artifact.data"
import {
  CreateArtifactEvent,
  ArtifactCreatedEvent,
  createArtifact,
  init as createInit,
} from "./artifact.create"
import {
  ArtifactRecordEvent,
  LoadArtifactRecordEvent,
  getArtifactRecord,
  init as getInit,
} from "./artifact.get"
import {
  ArtifactListEvent,
  LoadArtifactListEvent,
  getArtifactList,
  init as listInit,
} from "./artifact.list"

export {
  dispatchIvcapCreateArtifact,
  onArtifactUploaded,
} from "./artifact.create"
export type {
  CreateArtifactEvent,
  ArtifactCreatedEvent,
} from "./artifact.create"
export { dispatchIvcapGetArtifactData, onArtifactData } from "./artifact.data"
export type { ArtifactDataEvent, LoadArtifactDataEvent } from "./artifact.data"
export {
  dispatchIvcapGetArtifactRecord,
  onArtifactRecord,
} from "./artifact.get"
export type {
  ArtifactRecordEvent,
  ArtifactRecord,
  LoadArtifactRecordEvent,
} from "./artifact.get"
export { dispatchIvcapGetArtifactList, onArtifactList } from "./artifact.list"
export type {
  ArtifactListEvent,
  ArtifactListItem,
  LoadArtifactListEvent,
} from "./artifact.list"

export interface Artifact<S extends ReduxState> {
  list: (
    props: PropT<LoadArtifactListEvent>,
    reducerF: ReduceF<S, ReduxAction & ArtifactListEvent>,
  ) => void
  getRecord: (
    props: PropT<LoadArtifactRecordEvent>,
    reducerF: ReduceF<S, ReduxAction & ArtifactRecordEvent>,
  ) => void
  getData: (
    props: PropT<LoadArtifactDataEvent>,
    reducerF: ReduceF<S, ReduxAction & ArtifactDataEvent>,
  ) => void
  create: (
    props: PropT<CreateArtifactEvent>,
    reducerF: ReduceF<S, ReduxAction & ArtifactCreatedEvent>,
  ) => void
}

export interface Artifact2<S extends ReduxState> {
  list: (
    props: PropT<LoadArtifactListEvent>,
    reducerF: ReduceF<S, ReduxAction & ArtifactListEvent>
  ) => void
}

export function artifacts<S extends ReduxState>(register: PiRegister): Artifact<S> {
  return {
    list: getArtifactList<S>(register),
    getRecord: getArtifactRecord<S>(register),
    getData: getArtifactData<S>(register),
    create: createArtifact<S>(register),
  }
}

// export function artifacts2<S extends ReduxState>(register: PiRegister): Artifact2<S> {
//   return {
//     list: getArtifactList2<S>(register),
//   }
// }

// type F<P, E extends { reqID?: string }, S extends ReduxState> = (apiURL: URL, register: PiRegister) => (props: PropT<P>) => PromiseT<S, E>

// function w<S extends ReduxState, P, E extends { reqID?: string }>(
//   f: F<P, E, S>,
//   register: PiRegister
// ): Promise<(props: PropT<P>) => Promise<ThenT<S, E>>> {
//   const x =  GetOAuthContext().then(({ ivcapURL }) => {
//     const apiURL = new URL(ivcapURL)
//     return f(apiURL, register)
//   })
//   const f2 = (props: PropT<P>) => x.then((f) => {
//     const r = f(props)
//     return r
//   })
//   return x
// }

// export function artifacts2<S extends ReduxState>(register: PiRegister): Artifact<S> {
//   const p = GetOAuthContext()
//   const list = p.then(({ ivcapURL }) => {
//     const apiURL = new URL(ivcapURL)
//     return getArtifactList<S>(apiURL, register)
//   })



//   const f = getArtifactList
//   const ff = w<S, LoadArtifactListEvent, ArtifactListEvent>(getArtifactList, register)
//   const x:(props: PropT<LoadArtifactListEvent>) => PromiseT<S, ArtifactListEvent> = ff

//   return GetOAuthContext().then(({ ivcapURL }) => {
//     const apiURL = new URL(ivcapURL)
//     return {
//       list: getArtifactList<S>(apiURL, register),
//       getRecord: getArtifactRecord<S>(apiURL, register),
//       getData: getArtifactData<S>(apiURL, register),
//       create: createArtifact<S>(apiURL, register),
//     }
//   })
// }


export function artifactInit(register: PiRegister): void {
  createInit(register)
  getInit(register)
  listInit(register)
  dataInit(register)
}
