import { start, DEFAULT_REDUX_STATE } from "@pihanga2/core"
import { init as pihangaInit } from "./app.pihanga"

import { AppState } from "./app.types"

import { init as joyInit } from "@pihanga2/joy-ui"
import { init as cardInit } from "@pihanga2/cards"

import { reducerInit } from "./app.reducer"

const inits = [joyInit, cardInit, pihangaInit, reducerInit]

const initState: AppState = {
  count: 0,
  ...DEFAULT_REDUX_STATE,
}

start(initState, inits, { disableSerializableStateCheck: true })
