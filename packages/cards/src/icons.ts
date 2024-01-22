import React from "react"

const icons: any[] = []

export type IconId = number

export function registerIcon(el: any): IconId {
  icons.push(el)
  return icons.length - 1
}

// can't figure out what the proper return type is, SVvgIconT does
// NOT work with <IconButton>
export function getIcon(idx: IconId, props?: any): React.ReactNode {
  const icon = icons[idx]
  if (!icon) return null
  const el = React.createElement(icon, props)
  return el
}
