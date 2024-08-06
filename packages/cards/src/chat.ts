import { createCardDeclaration, PiCardRef } from "@pihanga2/core"

export const CHAT_CARD = "chat"
export const Chat = createCardDeclaration<ChatProps>(CHAT_CARD)

export type ChatProps<S = any> = {
  messages: ChatMessage[]
  style?: S
  className?: string
}

export type ChatMessage = {
  content: PiCardRef
  side: "left" | "right"
  sender?: string
  avatar?: PiCardRef
  date?: Date
}
