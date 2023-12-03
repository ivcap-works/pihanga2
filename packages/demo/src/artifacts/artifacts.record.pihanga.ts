import { PiRegister, ReduxAction, memo } from "@pihanga/core"
import { ACTION_TYPES, TbDataGrid } from "../tabler/cards/tbDataGrid"
import {
  ArtifactCard,
  ArtifactState,
  FetchedArtifactRecord,
} from "./artifacts.types"
import { AppCard } from "../app.pihanga"
import { DataGridEl, DataGridElType } from "../tabler/cards/tbDataGrid"

export function init(register: PiRegister): void {
  register.card(
    ArtifactCard.Record,
    TbDataGrid<ArtifactState>({
      items: memo(
        (s) => s.artifacts.records[s.artifacts.recordShown || ""],
        artifactDetail,
      ),
      wrapInCard: true,
      cardOnEmpty: AppCard.Spinner,
    }),
  )
}

function artifactDetail(artifact: FetchedArtifactRecord): DataGridEl[] {
  if (!artifact || !artifact.record) return []

  const record = artifact.record
  let a = ["status", "size", "mimeType"].map(
    (k): DataGridEl => ({
      id: k,
      type: k === "size" ? DataGridElType.Text : DataGridElType.Text,
      value: (record as any)[k],
    }),
  )
  a.push({ type: DataGridElType.Separator })
  a = a.concat(
    ["id", "accountID"].map(
      (k): DataGridEl => ({
        id: k,
        title: k === "id" ? "Artifact ID" : undefined,
        type: DataGridElType.Text,
        value: (record as any)[k],
      }),
    ),
  )

  // metadata
  // a.push({ type: DataGridElType.Separator, title: 'Metadata' })
  // a = a.concat(artifactMetadata(ar))
  // // optional preview
  // if (artifact.mimeType.startsWith("image/")) {
  //   a.push({ type: DataGridElType.Separator })
  //   a.push({
  //     id: "preview",
  //     title: "-",
  //     label: "Preview",
  //     type: DataGridElType.Button,
  //     actionTemplate: {
  //       type: ACTION_TYPES.REQUEST_ARTIFACT_IN_MODAL,
  //       artifact: artifact,
  //     } as ReduxAction & RequestArtifactInModalEvent,
  //   })
  // }


  // a.push({ type: DataGridElType.Separator })
  // a = a.concat(['orderedAt', 'startedAt', 'finishedAt'].map((k) => ({
  //   id: k,
  //   type: DataGridElType.Date,
  //   value: (order as any)[k],
  // })))
  // a.push({ type: DataGridElType.Separator })
  // a = a.concat(['serviceID', 'accountID'].map((k) => ({
  //   id: k,
  //   type: DataGridElType.Text,
  //   value: (order as any)[k],
  // })))
  // a.push({ type: DataGridElType.Separator, title: 'Parameters' })
  // a = a.concat(order.parameters.map(orderParam))
  // a = a.concat(orderProducts(order))

  return a
}
