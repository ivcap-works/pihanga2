import { ColorT, DecoratorT, VariantT } from "./common"

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

export type SomeEvent = {
  something: string
}

export type ComponentEvents = {
  onSomething: SomeEvent
}
