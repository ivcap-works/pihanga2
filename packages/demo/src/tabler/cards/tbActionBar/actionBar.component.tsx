import React from "react"
import { PiCardProps } from "@pihanga/core"
import cls from "classnames"
//import styles from "./page.module.css"

import { IconSearch } from "@tabler/icons-react"
import { TbIcon } from "../../components"

export type ComponentProps = {
  tabs?: NavBarItem[]
  activeTab?: string // == id in tabs
  showSearch?: boolean
}

export type NavBarItem = {
  id: string
  title: string
  icon?: string
  subItems?: SubItem[]
}

export type SubItem = {
  id: string
  title: string
}

export type SelectEvent = {
  actionID: string
}

export type ComponentEvents = {
  onSelect: SelectEvent
}

export const Component = (
  props: PiCardProps<ComponentProps, ComponentEvents>,
): React.ReactNode => {
  const { cardName, tabs = [], activeTab, showSearch, onSelect } = props

  function onBarSelect(el: NavBarItem) {
    onSelect({ actionID: el.id })
  }

  function onDropDownSelect(el: NavBarItem) {
    onSelect({ actionID: el.id })
  }

  function onSearch(el: React.FormEvent<HTMLFormElement>) {
    console.log("SEARCH", el)
  }

  function onSearchUpdate(el: React.ChangeEvent<HTMLInputElement>) {
    console.log("SEARCH UPDATE", el)
  }

  function renderSearchBar() {
    if (!showSearch) return
    return (
      <div className="my-2 my-md-0 flex-grow-1 flex-md-grow-0 order-first order-md-last">
        {/* <form action="./" method="get" autocomplete="off" novalidate> */}
        <form action="./" method="get" onChange={onSearch}>
          <div className="input-icon">
            <span className="input-icon-addon">
              <IconSearch />
            </span>
            <input
              type="text"
              value=""
              onChange={onSearchUpdate}
              className="form-control"
              placeholder="Search…"
              aria-label="Search in console"
            />
          </div>
        </form>
      </div>
    )
  }

  function renderItem(el: NavBarItem, idx: number) {
    if (el.subItems) {
      return renderDropDown(el, idx)
    } else {
      return renderSimpleTab(el, idx)
    }
  }

  function renderSimpleTab(el: NavBarItem, idx: number) {
    return (
      <li
        className={cls("nav-item", { active: el.id === activeTab })}
        style={{ cursor: "pointer" }}
        key={idx}
      >
        <a className="nav-link" onClick={() => onBarSelect(el)}>
          {renderIcon(el)}
          <span className="nav-link-title">{el.title}</span>
        </a>
      </li>
    )
  }

  function renderIcon(el: NavBarItem) {
    if (!el.icon) return null

    return (
      <span className="nav-link-icon d-md-none d-lg-inline-block">
        <TbIcon iconName={el.icon} />
      </span>
    )
  }

  function renderDropDown(el: NavBarItem, idx: number) {
    return (
      <li
        className={cls("nav-item", "dropdown", { active: el.id === activeTab })}
        key={idx}
      >
        <a
          className="nav-link dropdown-toggle"
          onSelect={() => null}
          data-bs-toggle="dropdown"
          data-bs-auto-close="outside"
          role="button"
          aria-expanded="false"
        >
          {renderIcon(el)}
          <span className="nav-link-title">{el.title}</span>
        </a>
        <div className="dropdown-menu">
          {el.subItems?.map(renderDropDownItem)}
        </div>
      </li>
    )
  }

  function renderDropDownItem(el: SubItem, idx: number) {
    return (
      <a
        className="dropdown-item"
        onClick={() => onDropDownSelect(el)}
        key={idx}
      >
        {el.title}
      </a>
    )
  }

  return (
    <div className="navbar-expand-md" data-pihanga={cardName}>
      <div className="collapse navbar-collapse" id="navbar-menu">
        <div className="navbar navbar-light">
          <div className="container-xl">
            <ul className="navbar-nav">{tabs.map(renderItem)}</ul>
            {renderSearchBar()}
          </div>
        </div>
      </div>
    </div>
  )
}
