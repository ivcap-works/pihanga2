import { PiRegister, memo, showPage } from "@pihanga/core"
import { ColumnType, TbDataTable } from "../tabler/cards/tbDataTable"
import { ArtifactCard, ArtifactState } from "./artifacts.types"
import { getList } from "./artifacts.reducer"
import { AppCard } from "../app.pihanga"

export function init(register: PiRegister): void {
  register.card(
    ArtifactCard.List,
    TbDataTable<ArtifactState>({
      columns: [
        { type: ColumnType.String, label: "id_short", title: "Id" },
        {
          type: ColumnType.String,
          label: "name",
          title: "Name",
          sortable: true,
        },
        {
          type: ColumnType.String,
          label: "status",
          title: "Status",
          sortable: true,
        },
      ],
      data: memo(
        (s) => s.artifacts.list.items,
        (items) =>
          items.map((el) => {
            const id = el.id.split(":")[3]
            const id_short = id.substring(id.length - 6)
            return {
              id,
              data: { ...el, id_short },
              //detailCard: "artifactEmbeddedDetailCard",
            }
          }),
      ),
      dataOffset: (s) => s.artifacts.list.offset,
      cardOnEmpty: AppCard.Spinner,
      onRowSelect: (s, { row }, dispatch) => {
        showPage(dispatch, ["artifacts", row.id as string])
        return s
      },
      // dataFormatter: {
      //   'date': (el: Date) => dataFormatter.format(el),
      // },
      // hasDetails: true,
      // manageDetails: true,
      showSearch: false,
      hasMore: (s) => s.artifacts.list.nextPage !== null,
      onNextPage: (s, _, d) => {
        getList({ page: s.artifacts.list.nextPage }, d)
        s.artifacts.list.items = []
        return s
      },
      onPrevPage: (s, _, d) => {
        getList({ page: s.artifacts.list.prevPage }, d)
        s.artifacts.list.items = []
        return s
      },
    }),
  )

  // register.card(ArtifactCard.Upload, PiFileDrop<ArtifactState>({})
}
