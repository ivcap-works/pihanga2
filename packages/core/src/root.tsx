import React from "react"
import { Provider } from "react-redux"

import { Card } from "./card"

export function RootComponent(store: any) {
  return (
    <React.StrictMode>
      <Provider store={store}>
        <Card cardName="_window" parentCard="" />
      </Provider>
    </React.StrictMode>
  )
}