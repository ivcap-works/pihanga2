import React from "react"

export type IconId = number

const icons: any[] = []
const name2icon: { [name: string]: IconId } = {}

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
