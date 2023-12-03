import { PropT, PromiseT } from "../common"
import { ReduxState, PiRegister } from "@pihanga/core"
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
  ) => PromiseT<S, ArtifactListEvent>
  getRecord: (
    props: PropT<LoadArtifactRecordEvent>,
  ) => PromiseT<S, ArtifactRecordEvent>
  getData: (
    props: PropT<LoadArtifactDataEvent>,
  ) => PromiseT<S, ArtifactDataEvent>
  create: (
    props: PropT<CreateArtifactEvent>,
  ) => PromiseT<S, ArtifactCreatedEvent>
}

export function artifacts<S extends ReduxState>(apiURL: URL, register: PiRegister): Artifact<S> {
  return {
    list: getArtifactList<S>(apiURL, register),
    getRecord: getArtifactRecord<S>(apiURL, register),
    getData: getArtifactData<S>(apiURL, register),
    create: createArtifact<S>(apiURL, register),
  }
}

export function init(register: PiRegister): void {
  createInit(register)
  getInit(register)
  listInit(register)
  dataInit(register)
}
