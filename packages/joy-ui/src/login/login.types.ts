import { IconId } from "@pihanga2/cards/src"
import { PiCardRef, createOnAction, registerActions } from "@pihanga2/core"

export const CARD_TYPE = "login"
// export const JyLogin = createCardDeclaration<LoginProps, ComponentEvents>(CARD_TYPE)

export const ACTION_TYPES = registerActions(CARD_TYPE, ["with_provider"])

export const onLoginWithProvider = createOnAction<LoginWithProviderEvent>(
  ACTION_TYPES.WITH_PROVIDER,
)

export type LoginProps = {
  // contentCard: PiCardRef
  headerTitle: string
  headerIcon?: IconId
  signInHelp?: PiCardRef
  loginProviders?: LoginProvider[]
  withLoginForm?: boolean
  showBackground?: boolean
  backgroundURL?: string
  footerText?: string
}

export type LoginProvider = {
  id: string
  title: string
  logo: IconId
}

export type LoginWithProviderEvent = {
  providerID: string
}

export type ComponentEvents = {
  onWithProvider: LoginWithProviderEvent
}
