import {
  start,
  getLogger,
  DEFAULT_REDUX_STATE,
  onInit,
  showPage,
} from "@pihanga/core"
import { init as ivcapInit, setAccessToken } from "@pihanga/ivcap"
import { init as tbInit } from "./tabler"
import { init as cardsInit } from "./cards/UNUSED"
import { init as pihangaInit } from "./app.pihanga"
import type { PiRegister } from "@pihanga/core"
import { AppState, DEF_SERVICE, SERVICES } from "./app.state"
import "./index.css"

import { init as artifactsInit } from "./artifacts"

const logger = getLogger("app")

const accessToken = import.meta.env.VITE_IVCAP_JWT
if (accessToken) {
  logger.info("using local access token 'VITE_IVCAP_JWT'")
  setAccessToken(accessToken)
}

function init(register: PiRegister): void {
  onInit<AppState>(register, (state, _, dispatch) => {
    if (!new Set(SERVICES).has(state.route.path[0])) {
      showPage(dispatch, [DEF_SERVICE], {})
    }
    return state
  })
}

const inits = [cardsInit, ivcapInit, tbInit, init, pihangaInit, artifactsInit]

const initState: AppState = {
  counter: {
    value: 0,
  },
  array: [],
  ...DEFAULT_REDUX_STATE,
}

start(initState, inits)
