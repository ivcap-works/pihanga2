import { onInit, onShowPage, showPage } from "@pihanga/core"
import { ArtifactState, ArtifactCard } from "./artifacts.types"
import { Artifact, LoadListProps } from "@pihanga/ivcap"
import type { DispatchF, PiRegister } from "@pihanga/core"

const ARTIFACT_ROOT = "artifacts"

export function getList(props: LoadListProps = {}, dispatch: DispatchF) {
  const p = { ...props }
  if (p.atTime) {
    p.atTime = p.atTime.toISOString() as any // force type
  }
  showPage(dispatch, [ARTIFACT_ROOT], p as any)
}

export function init(
  register: PiRegister,
  ivcapAPI: Artifact<ArtifactState>,
): void {
  onInit<ArtifactState>(register, (state) => {
    state.artifacts = {
      list: { items: [], offset: 0 },
      records: {},
    }
    return state
  })

  onShowPage<ArtifactState>(register, (state, { path, query }, dispatch) => {
    if (path[0] === "artifacts") {
      state.contentCard = ArtifactCard.Main
      const sa = state.artifacts
      if (path.length === 1) {
        sa.recordShown = undefined
        sa.list.items = []
        ivcapAPI
          .list(query || {})
          .reduce((s, { artifacts, offset, nextPage, prevPage }) => {
            s.artifacts.list = { items: artifacts, offset, nextPage, prevPage }
            return s
          })
      } else if (path.length === 2) {
        const recID = path[1]
        sa.records[recID] = { ...sa.records[recID], id: recID, isPending: true }
        sa.recordShown = recID
        ivcapAPI.getRecord({ id: recID }).reduce((s, { artifact }) => {
          s.artifacts.records[recID] = {
            id: recID,
            record: artifact,
            fetchedAt: Date.now(),
            isPending: false,
          }
          return s
        })
      } else {
        // force to legal format
        showPage(dispatch, ["artifacts", path[1]], {})
      }
    }
    return state
  })
}
