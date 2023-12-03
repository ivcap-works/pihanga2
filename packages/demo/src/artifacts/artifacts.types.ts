import { ArtifactListItem, ArtifactRecord } from "@pihanga/ivcap"
import { AppState } from "../app.state"

export type ArtifactState = AppState & {
  artifacts: {
    list: {
      items: ArtifactListItem[]
      offset: number
      nextPage?: string
      prevPage?: string
    }
    records: { [id: string]: FetchedArtifactRecord }
    recordShown?: string
  }
}

export type FetchedArtifactRecord = {
  id: string
  record?: ArtifactRecord
  fetchedAt?: number
  isPending: boolean
}

export enum ArtifactCard {
  Main = "artifact",
  List = "artifact/list",
  Record = "artifact/record",
  Upload = "artifact/upload",
}
