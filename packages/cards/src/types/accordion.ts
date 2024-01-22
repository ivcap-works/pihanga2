import {
  PiCardRef,
  createCardDeclaration,
  createOnAction,
  registerActions,
} from "@pihanga/core"
import { ColorT, SizeT, VariantT } from "."

export const CARD_TYPE = "accordion"

export const ACTION_TYPES = registerActions(CARD_TYPE, ["changed"])

export const onChanged = createOnAction<ChangedEvent>(ACTION_TYPES.CHANGED)

export const Accordion = createCardDeclaration<AccordionProps, ComponentEvents>(
  CARD_TYPE,
)

export type AccordionProps = {
  items: Item[]
  size?: SizeT
  disableDivider?: boolean // if true, the divider between accordions will be hidden.
  variant?: VariantT
}

export type Item = {
  id: string
  title: string | PiCardRef | PiCardRef[]
  content: string | PiCardRef | PiCardRef[]
  expanded?: boolean // If true, expands the accordion, otherwise collapse it.
  disabled?: boolean
  variant?: VariantT
  color?: ColorT
  defaultExpanded?: boolean //  If true, expands the accordion by default.
}

export type ChangedEvent = {
  itemID: string
  expanded: boolean
}

export type ComponentEvents = {
  onChanged: ChangedEvent
}
