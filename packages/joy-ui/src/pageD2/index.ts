import {
  type PiCardDef,
  type PiCardRef,
  type PiMapProps,
  type PiRegister,
  type ReduxState,
  type RegisterCardF,
  createCardDeclaration,
  type PiDefCtxtProps,
  actionTypesToEvents,
} from "@pihanga/core"

import {
  ACTION_TYPES,
  type ComponentEvents,
  type ComponentProps,
} from "./pageD2.types"
import { JyHeader } from "../header"
import { JySidebar } from "../sidebar"
import { JyList } from "../list"
import { JyPage1 } from "../pageD1"
import { JyBreadcrumbs } from "../breadcrumbs"
import { Item } from "@pihanga/cards/dist/types/list"
import { StateMapper } from "@pihanga/core/dist/types"

export const PAGED2_TYPE = "joy/pageD2"
export const JyPageD2 = createCardDeclaration<ComponentProps, ComponentEvents>(
  PAGED2_TYPE,
)

function mapper(
  name: string,
  props: PiMapProps<ComponentProps, ReduxState, ComponentEvents>,
  registerCard: RegisterCardF,
): PiCardDef {
  let sidebarIsOpen = false

  const header = registerCard(
    "header",
    JyHeader({
      title: props.headerTitle,
      onMenuClicked: (s, _) => {
        sidebarIsOpen = !sidebarIsOpen
        return s
      },
    }),
  )

  const mainMenu = registerCard(
    "mainMenu",
    JyList({
      items: props.mainMenu,
      onItemClicked: (s, a, d) => {
        d({
          type: ACTION_TYPES.MENU_CLICKED,
          cardID: name,
          itemID: a.itemID,
        })
        return s
      },
      onItemClickedMapper: props.mainMenuOnItemClickedMapper
    }),
  )

  let secondaryMenu: PiCardRef | undefined = undefined
  if (props.secondaryMenu) {
    // keep the type checker happy
    const items = props.secondaryMenu as
      | Item[]
      | StateMapper<Item[], ReduxState, PiDefCtxtProps>
    secondaryMenu = registerCard(
      "secondaryMenu",
      JyList({
        items,
      }),
    )
  }

  const sidebar = registerCard(
    "sidebar",
    JySidebar({
      isOpen: () => sidebarIsOpen,
      logoIcon: props.logoIcon,
      user: props.user,
      title: props.headerTitle,
      menuCard: mainMenu,
      secondaryMenuCard: secondaryMenu,
      onCloseSidebar: (s) => {
        sidebarIsOpen = false
        return s
      },
    }),
  )

  const breadcrumbs = registerCard(
    "breadcrumbs",
    JyBreadcrumbs({ breadcrumbs: props.breadcrumbs }),
  )

  const main = JyPage1({
    pageTitle: props.pageTitle,
    headerCard: header,
    contentCard: props.content,
    sidebarCard: sidebar,
    breadcrumbsCard: breadcrumbs,
    actionCard: props.actionCard,
    modalCard: props.modal,
  })
  main.onMenuClicked = props.onMenuClicked
  return main
}

export function init(register: PiRegister): void {
  register.metaCard<ComponentProps>({
    type: PAGED2_TYPE,
    mapper,
    events: actionTypesToEvents(ACTION_TYPES),
  })
}
