import { type PiRegister } from "@pihanga2/core"

import { AppCard, AppState } from "./app.types"
import { Button, PageD1, Stack, Typography } from "@pihanga2/cards"

export function init(register: PiRegister): void {
  register.window<AppState>({
    page: () => AppCard.Main,
  })

  register.card(
    AppCard.Main,
    PageD1({
      contentCards: [
        Stack({
          content: [
            Typography({
              text: "Hello World",
              level: "title-lg",
            }),
            Typography<AppState>({
              text: (s) => `${s.count}`,
              level: "body-md",
              textAlign: "center",
            }),
            Button<AppState>({
              label: "Increment",
              onClicked: (s) => {
                s.count += 1
              },
            }),
          ],
          spacing: 2,
        }),
      ],
      hideColorSchemeToggle: true,
      style: {
        joy: {
          outer: {
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          },
          inner: { maxWidth: "600px", paddingTop: "10vh" },
        },
      },
    }),
  )
}
