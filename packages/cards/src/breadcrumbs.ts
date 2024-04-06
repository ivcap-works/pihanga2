import {
  createCardDeclaration,
  createOnAction,
  registerActions,
} from "@pihanga2/core"
import { ColorT, DecoratorT, VariantT } from "./common"

export const BREADCRUMB_TYPE = "breadcrumb"
export const Breadcrumbs = createCardDeclaration<
  BreadcrumbsProps,
  BreadcrumbEvents
>(BREADCRUMB_TYPE)

export const BREADCRUMB_ACTION = registerActions(BREADCRUMB_TYPE, ["select"])

export const onSelect = createOnAction<BreadcrumbSelectEvent>(
  BREADCRUMB_ACTION.SELECT,
)

export type BreadcrumbsProps = {
  breadcrumbs: BreadCrumb[]
}

export type BreadCrumb = {
  id: string
  label?: string
  color?: ColorT
  fontSize?: number
  fontWeight?: number
  decorator?: DecoratorT
  disabled?: boolean
  variant?: VariantT
  underline?: UnderlineE
}

export enum UnderlineE {
  Hover = "hover",
  Always = "always",
  None = "none",
}

export type BreadcrumbSelectEvent = {
  id: string
}

export type BreadcrumbEvents = {
  onSelect: BreadcrumbSelectEvent
}
