import { showPage, type PiRegister } from "@pihanga/core"
import { TbButton } from "./tabler/cards/tbButton"
import { AppState, SERVICES } from "./app.state"
import { TbButtonType } from "./tabler/cards"
import { registerTbIcon } from "./tabler/components"
import {
  IconBox,
  IconChecklist,
  IconHammer,
  IconRefresh,
} from "@tabler/icons-react"
import { TbActionBar } from "./tabler/cards/tbActionBar"
import { TbPage } from "./tabler/cards/tbPage"
import { TbSpinner } from "./tabler/cards/tbSpinner"

registerTbIcon("order", IconChecklist)
registerTbIcon("service", IconHammer)
registerTbIcon("artifact", IconBox)
registerTbIcon("refresh", IconRefresh)

export enum AppCard {
  Page = "page",
  ActionBar = "app/actionBar",
  RefreshButton = "app/refresh",
  Spinner = "app/spinner",
}

const DEF_PAGE = "orders"

export function init(register: PiRegister): void {
  //demo1(register)
  //demo2(register)

  register.card(
    AppCard.Page,
    TbPage<AppState>({
      title: "Demo",
      contentCard: (s) => s.contentCard || "demoContent",
      actionBar: AppCard.ActionBar,
    }),
  )

  register.card(
    AppCard.ActionBar,
    TbActionBar<AppState>({
      activeTab: (s) => (s.route.path || [DEF_PAGE])[0],
      // tabs: [
      //   { id: "orders", title: "Orders", icon: "order" },
      //   { id: "artifacts", title: "Artifacts", icon: "artifact" },
      //   { id: "services", title: "Services", icon: "service" },
      // ],
      tabs: SERVICES.map((id) => {
        const title = `${id[0].toLocaleUpperCase()}${id.slice(1)}`
        const icon = id.slice(0, -1)
        return { id, title, icon }
      }),
      showSearch: false,
      onSelect: (s, { actionID }, dispatch) => {
        showPage(dispatch, [actionID], {})
        return s
      },
    }),
  )

  register.card(
    AppCard.RefreshButton,
    TbButton<AppState>({
      name: "refresh",
      title: "Refresh",
      isGhostButton: true,
      buttonType: TbButtonType.Secondary,
      style: {
        textTransform: "uppercase",
      },
      iconName: "refresh", // defined in app.component
      iconStyle: {
        marginRight: "calc(var(--tblr-btn-padding-x) / 4)",
      },
    }),
  )

  register.card(AppCard.Spinner, TbSpinner<AppState>({}))
}
