import {
  PiCardRef,
  createCardDeclaration,
  createOnAction,
  registerActions,
} from "@pihanga/core"
import { ColorT, SizeT, VariantT } from "./types/common"

export const ACCORDION_TYPE = "accordion"

export const ACCORDION_ACTION = registerActions(ACCORDION_TYPE, ["changed"])

export const onChanged = createOnAction<AccordionChangedEvent>(
  ACCORDION_ACTION.CHANGED,
)

export const Accordion = createCardDeclaration<AccordionProps, AccordionEvents>(
  ACCORDION_TYPE,
)

export type AccordionProps = {
  items: AccordionItem[]
  size?: SizeT
  disableDivider?: boolean // if true, the divider between accordions will be hidden.
  variant?: VariantT
}

export type AccordionItem = {
  id: string
  title: string | PiCardRef | PiCardRef[]
  content: string | PiCardRef | PiCardRef[]
  expanded?: boolean // If true, expands the accordion, otherwise collapse it.
  disabled?: boolean
  variant?: VariantT
  color?: ColorT
  defaultExpanded?: boolean //  If true, expands the accordion by default.
}

export type AccordionChangedEvent = {
  itemID: string
  expanded: boolean
}

export type AccordionEvents = {
  onChanged: AccordionChangedEvent
}
