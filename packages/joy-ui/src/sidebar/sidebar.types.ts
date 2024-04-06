import {
  PiCardRef,
  createCardDeclaration,
  createOnAction,
  registerActions,
} from "@pihanga2/core"
import { IconId } from "@pihanga2/cards/src/icons"

export const SIDEBAR_TYPE = "sidebar"
export const Sidebar = createCardDeclaration<SidebarProps, SidebarEvents>(
  SIDEBAR_TYPE,
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
  withColorSchemeToggle?: boolean
}

export const SIDEBAR_ACTION = registerActions(SIDEBAR_TYPE, [
  "open_sidebar",
  "close_sidebar",
  "user_logout",
])

export const onOpenSidebar = createOnAction<CloseSidebarEvent>(
  SIDEBAR_ACTION.OPEN_SIDEBAR,
)

export const onCloseSidebar = createOnAction<CloseSidebarEvent>(
  SIDEBAR_ACTION.CLOSE_SIDEBAR,
)

export const onUserLogout = createOnAction<UserLogoutEvent>(
  SIDEBAR_ACTION.USER_LOGOUT,
)

export type OpenSidebarEvent = {}
export type CloseSidebarEvent = {}
export type UserLogoutEvent = {}

export type SidebarEvents = {
  onOpenSidebar: OpenSidebarEvent
  onCloseSidebar: CloseSidebarEvent
  onUserLogout: UserLogoutEvent
}
