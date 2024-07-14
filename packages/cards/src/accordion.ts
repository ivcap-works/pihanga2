import {
  PiCardRef,
  createCardDeclaration,
  createOnAction,
  registerActions,
} from "@pihanga2/core"
import { ColorT, SizeT, VariantT } from "./common"

export const ACCORDION_CARD = "accordion"
export const ACCORDION_ACTION = registerActions(ACCORDION_CARD, ["changed"])

export const Accordion = createCardDeclaration<AccordionProps, AccordionEvents>(
  ACCORDION_CARD,
)

export const onChanged = createOnAction<AccordionChangedEvent>(
  ACCORDION_ACTION.CHANGED,
)

export type AccordionProps<S = any> = {
  items: AccordionItem[]
  size?: SizeT
  disableDivider?: boolean // if true, the divider between accordions will be hidden.
  variant?: VariantT

  className?: string
  style?: S
}

export type AccordionItem = {
  id: string
  title: PiCardRef | PiCardRef[] | string
  content: string | PiCardRef | PiCardRef[]
  context?: any // added to events
  expanded?: boolean // If true, expands the accordion, otherwise collapse it.
  disabled?: boolean
  variant?: VariantT
  color?: ColorT
  defaultExpanded?: boolean //  If true, expands the accordion by default.
}

export type AccordionChangedEvent = {
  itemID: string
  expanded: boolean
  context?: any
}

export type AccordionEvents = {
  onChanged: AccordionChangedEvent
}
