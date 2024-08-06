import React from "react"

declare global {
  interface Window {
    PihangaIcons: G
  }
}

export type IconId = number

type G = {
  icons: any[]
  name2icon: { [name: string]: IconId }
}

window.PihangaIcons = window.PihangaIcons || {
  icons: [],
  name2icon: {},
}

const icons = window.PihangaIcons.icons
const name2icon = window.PihangaIcons.name2icon

export function registerIcon(el: any, name?: string): IconId {
  icons.push(el)
  const id = icons.length - 1
  if (name) {
    if (name2icon[name] !== undefined) {
      throw new Error(`icon '${name}' already registered`)
    }
    name2icon[name] = id
  }
  return id
}

export function getIconId(name: string): IconId | undefined {
  return name2icon[name]
}

// can't figure out what the proper return type is, SVvgIconT does
// NOT work with <IconButton>
export function getIcon(idx: IconId, props?: any): React.ReactNode {
  const icon = icons[idx]
  if (!icon) return null
  // if (typeof icon === "object" && icon["$$typeof"]) {
  //   return icon
  // }
  const el = React.createElement(icon, props)
  return el
}
