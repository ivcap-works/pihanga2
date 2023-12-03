import { PiRegister } from "@pihanga/core"

import { init as pihangaInit } from "./artifacts.pihanga"
import { init as reducerInit } from "./artifacts.reducer"
import { artifacts } from "@pihanga/ivcap"
import { ArtifactState } from "./artifacts.types"

export function init(register: PiRegister): void {
  const ivcapAPI = artifacts<ArtifactState>(new URL("https://develop.ivcap.net"), register)

  // artifactAPI.list({}).then(({ artifacts }) => {
  //   console.log("list")
  //   artifactAPI
  //     .getRecord<AppState>({ id: artifacts[0].id })
  //     .reduce((s: AppState, a: ArtifactRecordEvent) => {
  //       console.log("record", a)
  //       return s
  //     })
  // })

  pihangaInit(register)
  reducerInit(register, ivcapAPI)
}
