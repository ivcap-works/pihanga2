import { PiRegister } from "@pihanga2/core"

// Import all local components
import { init as frameworkInit } from "./framework"
import { init as boxInit } from "./box"
import { init as headerInit } from "./header"
import { init as page1Init } from "./pageD1"
import { init as sidebarInit } from "./sidebar"
import { init as chipInit } from "./chip"
import { init as listInit } from "./list"
import { init as breadcrumbsInit } from "./breadcrumbs"
import { init as tableInit } from "./table"
import { init as buttonInit } from "./button"
import { init as iconButtonInit } from "./iconButton"
import { init as buttonGroupInit } from "./buttonGroup"
import { init as linkInit } from "./link"
import { init as dataGridInit } from "./dataGrid"
import { init as typographyInit } from "./typography"
import { init as accoridionInit } from "./accordion"
import { init as colorSchemeToggleInit } from "./colorSchemeToggle"
import { init as page2Init } from "./pageD2"
import { init as modalInit } from "./modal"
import { init as spinnerInit } from "./spinner"
import { init as loginInit } from "./login"

export * from "./icons"

export * from "./framework"
export * from "./table"
// export type * from "@pihanga2/cards/src/table"


export * from "./accordion"
export * from "./button"
export * from "./buttonGroup"

export * from "./dataGrid"

export * from "./pageD2"

export function init(register: PiRegister): void {
  frameworkInit(register)
  boxInit(register)
  headerInit(register)
  page1Init(register)
  sidebarInit(register)
  chipInit(register)
  listInit(register)
  breadcrumbsInit(register)
  tableInit(register)
  buttonInit(register)
  iconButtonInit(register)
  buttonGroupInit(register)
  linkInit(register)
  dataGridInit(register)
  typographyInit(register)
  accoridionInit(register)
  colorSchemeToggleInit(register)
  modalInit(register)
  spinnerInit(register)
  loginInit(register)

  page2Init(register)

}
