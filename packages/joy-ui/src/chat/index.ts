import { createCardDeclaration, PiRegister } from "@pihanga2/core"

import { ChatComponent } from "./chat.component"
import { ChatProps } from "@pihanga2/cards"

const JOY_CHAT_CARD = "joy/chat"
export const JyChat = createCardDeclaration<ChatProps>(JOY_CHAT_CARD)

export function chatInit(register: PiRegister): void {
  register.cardComponent({
    name: JOY_CHAT_CARD,
    component: ChatComponent,
  })
}
