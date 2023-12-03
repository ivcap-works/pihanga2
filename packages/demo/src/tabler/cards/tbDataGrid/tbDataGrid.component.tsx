import { Card, PiCardRef, PiCardProps, ReduxAction } from "@pihanga/core"
import React from "react"
import { TbButtonType, TbColor } from "../constants"
import { Icon as TablerIcon } from "@tabler/icons-react"
import styles from "./tbDataGrid.module.css"

export type ComponentProps = {
  title?: string
  wrapInCard?: boolean // when true wrap in Tb Card
  items: DataGridEl[]
  cardOnEmpty?: PiCardRef // card to display when no items are available
  dateFormatter?: (d: Date) => string
}

const DEF_DATE_FORMATTER = new Intl.DateTimeFormat([], {
  dateStyle: "short",
  timeStyle: "short",
})

export type DataGridEl =
  | TextEl
  | LinkEl
  | StatusEl
  | CheckboxEl
  | InputEl
  | DateEl
  | ButtonEl
  | CardEl
  | SeparatorEl

type TiteledEl = {
  id: string
  title?: string
}

type TextEl = TiteledEl & {
  type: DataGridElType.Text
  value: string
  icon?: TablerIcon
  avatarUrl?: string
}
type LinkEl = TiteledEl & {
  type: DataGridElType.Link
  value: string
  icon?: TablerIcon
  actionMapper?: <A extends ReduxAction>(el: LinkEl) => A
}
type StatusEl = TiteledEl & {
  type: DataGridElType.Status
  value: string
  statusColor?: TbColor
}
type CheckboxEl = TiteledEl & {
  type: DataGridElType.Checkbox
  value: string
  checked?: boolean
}
type InputEl = TiteledEl & {
  type: DataGridElType.Input
  placeHolder?: string
}
type DateEl = TiteledEl & {
  type: DataGridElType.Date
  value?: Date | string
}
type ButtonEl = TiteledEl & {
  type: DataGridElType.Button
  label: string
  buttonType?: TbButtonType
  actionMapper?: <A extends ReduxAction>(el: ButtonEl) => A
}
type CardEl = TiteledEl & {
  type: DataGridElType.Card
  cardName: string
  context?: { [k: string]: string }
}
type SeparatorEl = {
  type: DataGridElType.Separator
  title?: string
}

export enum DataGridElType {
  Text = "text",
  Link = "link",
  Status = "status",
  Checkbox = "checkbox",
  Input = "input",
  Date = "date",
  Button = "button",
  Card = "card",
  Separator = "separator",
}

export type ButtonClickedEvent = {
  buttonID: string
}

export type LinkClickedEvent = {
  linkID: string
}

export type ComponentEvents = {
  onButtonClicked: ButtonClickedEvent
  onLinkClicked: LinkClickedEvent
}

export const Component = (
  props: PiCardProps<ComponentProps, ComponentEvents>,
): React.ReactNode => {
  const {
    items,
    title,
    wrapInCard = false,
    dateFormatter = DEF_DATE_FORMATTER.format,
    cardOnEmpty,
    onButtonClicked,
    onLinkClicked,
    cardName,
    _dispatch,
  } = props
  const cls = (...n: string[]) => props._cls(n[0], styles)

  if (cardOnEmpty && items.length === 0) {
    return (
      <div className={cls("empty")}>
        <Card cardName={cardOnEmpty} />
      </div>
    )
  }

  function buttonClicked(el: ButtonEl): void {
    if (el.actionMapper) {
      _dispatch(el.actionMapper(el))
    } else {
      onButtonClicked({
        buttonID: el.id,
      })
    }
  }

  function renderText(el: TextEl): React.ReactNode {
    if (el.avatarUrl != null) {
      return renderTextWithAvatar(el)
    }

    return (
      <div className={cls("content-link")} key="link">
        {el.icon != null && React.createElement(el.icon)}
        {el.value}
      </div>
    )
  }

  function renderLink(el: LinkEl): React.ReactNode {
    const onClick = (ev: React.MouseEvent<HTMLAnchorElement>): void => {
      if (el.actionMapper) {
        _dispatch(el.actionMapper(el))
      } else {
        onLinkClicked({ linkID: el.id })
      }
      ev.preventDefault()
    }
    return (
      <div className={cls("content", "content-text")} key="text">
        <a href="#" onClick={onClick}>
          {el.icon != null && React.createElement(el.icon)}
          {el.value}
        </a>
      </div>
    )
  }

  function renderDate(el: DateEl): React.ReactNode {
    let v = el.value || "-"
    if (v instanceof Date) {
      v = dateFormatter(v)
    }
    return renderText({ ...el, type: DataGridElType.Text, value: v })
  }

  function renderTextWithAvatar(el: TextEl): React.ReactNode {
    return (
      <div className={cls("content", "content-text-avatar")} key="textA">
        <div className="d-flex align-items-center">
          <span
            className="avatar avatar-xs me-2 rounded"
            style={{ backgroundImage: `url(${el.avatarUrl})` }}
          />
          {el.value}
        </div>
      </div>
    )
  }

  function renderStatus(el: StatusEl): React.ReactNode {
    return (
      <div className={cls("content", "content-status")} key="status">
        <span className={`status status-${el.statusColor}`}>{el.value}</span>
      </div>
    )
  }

  function renderCheckbox(el: CheckboxEl): React.ReactNode {
    return (
      <div className={cls("content", "content-checkbox")} key="checkbox">
        <label className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            checked={el.checked}
          />
          <span className="form-check-label">{el.value}</span>
        </label>
      </div>
    )
  }

  function renderInput(el: InputEl): React.ReactNode {
    return (
      <div className={cls("content", "content-input")} key="input">
        <input
          type="text"
          className="form-control form-control-flush"
          placeholder={el.placeHolder}
        />
      </div>
    )
  }

  function renderButton(el: ButtonEl): React.ReactNode {
    const btn_cls = `btn btn-${el.buttonType || TbButtonType.Primary}`
    return (
      <div className={cls("content", "content-button")}>
        <button className={btn_cls} onClick={(): void => buttonClicked(el)}>
          {el.label}
        </button>
      </div>
    )
  }

  function renderCard(el: CardEl): React.ReactNode {
    return (
      <div className={cls("content", "content-input")} key="card">
        <Card cardName={el.cardName} {...el.context} />
      </div>
    )
  }

  function renderItemContent(el: DataGridEl): React.ReactNode {
    switch (el.type) {
      case DataGridElType.Text:
        return renderText(el)
      case DataGridElType.Link:
        return renderLink(el)
      case DataGridElType.Date:
        return renderDate(el)
      case DataGridElType.Checkbox:
        return renderCheckbox(el)
      case DataGridElType.Input:
        return renderInput(el)
      case DataGridElType.Status:
        return renderStatus(el)
      case DataGridElType.Button:
        return renderButton(el)
      case DataGridElType.Card:
        return renderCard(el)
      default:
        return (
          <div className={cls("content", "content-unknown")} key="unknown">
            ERROR: Unknown type '{el.type}'
          </div>
        )
    }
  }

  function renderItem(el: DataGridEl, idx: number): React.ReactNode {
    if ("id" in el) {
      const title = el.title || camelToWords(el.id)
      return (
        <div
          className={`tb-datagrid-item pi-tb-item-${el.type} pi-tb-item-${el.id}`}
          key={idx}
        >
          {title !== "-" && (
            <div className="tb-datagrid-title datagrid-title" key="title">
              {title}{" "}
            </div>
          )}
          {renderItemContent(el)}
        </div>
      )
    } else {
      return (
        <div className={`tb-datagrid-item pi-tb-item-${el.type}`} key={idx}>
          {renderItemContent(el)}
        </div>
      )
    }
  }

  function renderTitle(): React.ReactNode {
    if (title == null) return null

    if (wrapInCard) {
      return (
        <div className="card-header card-header-light">
          <h3 className="card-title">{title}</h3>
        </div>
      )
    } else {
      return <h3 className="card-title">{title}</h3>
    }
  }

  function renderGrid(
    grid: { title?: string; els: DataGridEl[] },
    idx: number,
  ): React.ReactNode {
    return (
      <div className={cls("grid")} key={idx}>
        {grid.title && <h4 className="pi-tb-sub-title">{grid.title}</h4>}
        <div className="datagrid">{grid.els.map(renderItem)}</div>
      </div>
    )
  }

  const grids = items.reduce(
    (p, el) => {
      if (el.type === DataGridElType.Separator) {
        p.push({ title: el.title, els: [] })
        return p
      } else {
        p.at(-1)?.els.push(el)
      }
      return p
    },
    [{ els: [] }] as { title?: string; els: DataGridEl[] }[],
  )

  function renderContent(): React.ReactNode {
    if (wrapInCard) {
      return (
        <div className="card">
          {renderTitle()}
          <div className="card-body">{grids.map(renderGrid)}</div>
        </div>
      )
    } else {
      return (
        <div className="card-body">
          {renderTitle()}
          {grids.map(renderGrid)}
        </div>
      )
    }
  }
  return (
    <div className={cls("root")} data-pihanga={cardName}>
      {renderContent()}
    </div>
  )
}

function camelToWords(s: string): string {
  return s
    .replace(/((?<!^)[A-Z](?![A-Z]))(?=\S)/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
}
