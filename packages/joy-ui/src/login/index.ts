import {
  PiRegister,
  createCardDeclaration,
  actionTypesToEvents,
} from "@pihanga2/core"

import { LoginComponent, type ComponentProps } from "./login.component"
import { type ComponentEvents, ACTION_TYPES } from "./login.types"
import { IconId, getIconId, registerIcon } from "@pihanga2/cards"
import { GoogleIcon, Auth0Icon } from "./provider.icon"
import { memo } from "react"

export * from "./login.types"

export const CARD_TYPE = "joy/login"
export const JyLogin = createCardDeclaration<ComponentProps, ComponentEvents>(
  CARD_TYPE,
)

export const GOOGLE_ICON_NAME = "googleProvider"
export const AUTH0_ICON_NAME = "auth0Provider"

export const AUTH_PROVIDER_ICONS: { [id: string]: IconId } = {}

export function init(register: PiRegister): void {
  register.cardComponent({
    name: CARD_TYPE,
    component: LoginComponent,
    events: actionTypesToEvents(ACTION_TYPES),
  })
  // eslint-disable-next-line prettier/prettier
  AUTH_PROVIDER_ICONS["google"] = registerIcon(memo(GoogleIcon), GOOGLE_ICON_NAME)
  AUTH_PROVIDER_ICONS["auth0"] = registerIcon(memo(Auth0Icon), AUTH0_ICON_NAME)
}
