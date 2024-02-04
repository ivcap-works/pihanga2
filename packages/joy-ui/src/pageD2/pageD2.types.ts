import { PiCardRef, ReduxAction, createOnAction, registerActions } from "@pihanga/core"
import { IconId } from "@pihanga/cards/dist/icons"
import {
  CARD_TYPE,
  ItemClickedEvent,
  Item as MenuItem,
} from "@pihanga/cards/dist/types/list"
import { BreadCrumb } from "@pihanga/cards/dist/types/breadcrumbs"

export const ACTION_TYPES = registerActions(CARD_TYPE, ["menu_clicked"])

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
  mainMenuOnItemClickedMapper?: (ev: ItemClickedEvent) => ReduxAction

  secondaryMenu?: MenuItem[]
  secondaryMenuOnItemClickedMapper?: (ev: ItemClickedEvent) => ReduxAction
}

export type UserProps = {
  name: string
  email?: string
  avatarSrc?: string
}

export type ComponentEvents = {
  onMenuClicked: ItemClickedEvent
}
