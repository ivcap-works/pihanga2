import {
  PiCardRef,
  createCardDeclaration,
  createOnAction,
  registerActions,
} from "@pihanga2/core"
import { IconId } from "@pihanga2/cards/src/icons"

export const CARD_TYPE = "sidebar"
export const Sidebar = createCardDeclaration<SidebarProps, ComponentEvents>(
  CARD_TYPE,
)

export const ACTION_TYPES = registerActions(CARD_TYPE, [
  "open_sidebar",
  "close_sidebar",
  "user_logout",
])

export const onOpenSidebar = createOnAction<CloseSidebarEvent>(
  ACTION_TYPES.OPEN_SIDEBAR,
)

export const onCloseSidebar = createOnAction<CloseSidebarEvent>(
  ACTION_TYPES.CLOSE_SIDEBAR,
)

export const onUserLogout = createOnAction<UserLogoutEvent>(
  ACTION_TYPES.USER_LOGOUT,
)

export type SidebarProps = {
  title: string
  isOpen: boolean
  menuCard?: PiCardRef
  secondaryMenuCard?: PiCardRef
  logoIcon?: IconId
  withSearch?: boolean
  user?: {
    name: string
    email?: string
    avatarSrc?: string
  }
}

export type OpenSidebarEvent = {}
export type CloseSidebarEvent = {}
export type UserLogoutEvent = {}

export type ComponentEvents = {
  onOpenSidebar: OpenSidebarEvent
  onCloseSidebar: CloseSidebarEvent
  onUserLogout: UserLogoutEvent
}
