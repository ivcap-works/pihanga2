import {
  createCardDeclaration,
  createOnAction,
  registerActions,
} from "@pihanga2/core"

export const CARD_TYPE = "header"

export const Header = createCardDeclaration<HeaderProps, ComponentEvents>(
  CARD_TYPE,
)

export const ACTION_TYPES = registerActions(CARD_TYPE, ["menu_clicked"])

export const onMenuClicked = createOnAction<MenuClickedEvent>(
  ACTION_TYPES.MENU_CLICKED,
)

export type HeaderProps = {
  title?: string
}

export type MenuClickedEvent = {}

export type ComponentEvents = {
  onMenuClicked: MenuClickedEvent
}
