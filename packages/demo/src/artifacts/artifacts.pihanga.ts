import { PiRegister, memo } from "@pihanga/core"
import { ArtifactCard, ArtifactState, FetchedArtifactRecord } from "./artifacts.types"
import { TbXlCard } from "../tabler/cards/tbXLCard"
import { AppCard } from "../app.pihanga"
import { init as listInit } from "./artifacts.list.pihanga"
import { init as recordInit } from "./artifacts.record.pihanga"
import { StateMapper } from "../../../core/src/types"

export function init(register: PiRegister): void {
  listInit(register)
  recordInit(register)

  register.card(
    ArtifactCard.Main,
    TbXlCard<ArtifactState>({
      title: titleM,
      contentCard: (s) =>
        s.artifacts.recordShown ? ArtifactCard.Record : ArtifactCard.List,
      // actionCards: [ArtifactCard.Upload],
      infoCards: [AppCard.RefreshButton],
    }),
  )
}

const titleM = memo(
  (s: ArtifactState): null | FetchedArtifactRecord => {
    const rid = s.artifacts.recordShown
    return s.artifacts.records[rid || ""]
  },
  (p) => (p ? p.record?.name || p.id : "Artifacts"),
)
