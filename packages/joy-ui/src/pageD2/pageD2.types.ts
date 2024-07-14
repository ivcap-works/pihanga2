import {
  PiCardRef,
  PiDefCtxtProps,
  ReduxAction,
  StateMapperContext,
  createOnAction,
  registerActions,
} from "@pihanga2/core"
import { IconId } from "@pihanga2/cards"
import {
  CARD_TYPE,
  ItemClickedEvent,
  Item as MenuItem,
} from "@pihanga2/cards/src/list"
import { BreadCrumb } from "@pihanga2/cards/src/breadcrumbs"

export const ACTION_TYPES = registerActions(CARD_TYPE, [
  "menu_clicked",
  "secondary_menu_clicked",
])

export const onItemClicked = createOnAction<ItemClickedEvent>(
  ACTION_TYPES.MENU_CLICKED,
)

export type ComponentProps = {
  headerTitle: string
  pageTitle: string
  content: PiCardRef
  modal?: PiCardRef

  logoIcon?: IconId
  withSearch?: boolean
  user?: UserProps

  breadcrumbs: BreadCrumb[]
  actionCard?: PiCardRef

  mainMenu: MenuItem[]
  secondaryMenu?: MenuItem[]
}

export type UserProps = {
  name: string
  email?: string
  avatarSrc?: string
}

export type ComponentEvents = {
  onMainMenuItemClicked: ItemClickedEvent
  onSecondaryMenuItemClicked: ItemClickedEvent
}
