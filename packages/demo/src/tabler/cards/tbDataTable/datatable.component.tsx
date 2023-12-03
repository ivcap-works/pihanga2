import React from "react"
import { Card, PiCardProps, PiCardRef, ReduxAction } from "@pihanga/core"
import {
  IconCaretRight,
  IconCaretDown,
  IconBell,
  IconStar,
  Icon,
} from "@tabler/icons-react"
import { TbButtonType } from "../constants"
import { TbIcon } from "../../components"
import styles from "./datatable.module.css"

type DEF_ROW_TYPE = { [k: string]: any }

export type ComponentProps<D = DEF_ROW_TYPE> = {
  columns: GenericColumn[]
  data: Row<D>[]
  rowSelectionActionMapper?: RowEventMapper<D>
  showDetailActionMapper?: RowEventMapper<D>
  dataFormatter?: ColumnDict<ColumnFormatter>
  hasDetails?: boolean // if true rows could show details
  manageDetails?: boolean // when true internally manage which detail card to show
  showLimit?: number // max number of results to show (might be less than data)
  dataOffset?: number // number of preceeding values not shown
  hasMore?: boolean // true when there are more entries to display
  recordCount?: number // number of records in dataset -1 .. unknown
  showPageSizeSelector?: boolean
  showSearch?: boolean
  showFooter?: boolean
  cardOnEmpty?: PiCardRef // card to display when no items are available
}

export type ColumnFormatter = (el: any, column: Column) => string

export type Column = {
  label: string
  title: string
  sortable?: boolean
  headerStyle?: React.CSSProperties
}

// Whenever something is added to ColumnType, also add it to ColumnDict
export enum ColumnType {
  String = "string",
  Number = "number",
  Boolean = "boolean",
  Date = "date",
  Progress = "progress",
  Button = "button",
  Toggle = "toggle",
  Icon = "icon",
  Status = "status",
  Hidden = "hidden",
  _Detail = "detail", // internal use only
}

// Can't make [k in ColumnType]:T work for optional (?) values
type ColumnDict<T> = {
  string?: T
  number?: T
  boolean?: T
  date?: T
  progress?: T
  button?: T
  toggle?: T
  icon?: T
  status?: T
  hidden?: T
}

export type Row<T = DEF_ROW_TYPE> = {
  id: string | number
  data: T //{ [k: string]: T };
  detailCard?: string
}

export type DetailContext<T = DEF_ROW_TYPE> = {
  row: Row<T>
}

export type RowEventMapper<T> = <A extends ReduxAction>(row: Row<T>) => A

export type RowSelectEvent<T = DEF_ROW_TYPE> = {
  row: Row<T>
}

export type ColSortEvent = {
  isAscending: boolean
  col: Column
}

type StringColumn = Column & {
  type: ColumnType.String
}

type DetailColumnT = Column & {
  type: ColumnType._Detail
  // isDetail?: boolean;
}

const DetailColumn: DetailColumnT = {
  label: "details",
  title: "", // nothing to show in header
  type: ColumnType._Detail,
  sortable: false,
}

type NumberColumn = Column & {
  type: ColumnType.Number
}

type BooleanColumn = Column & {
  type: ColumnType.Boolean
}

type DateColumn = Column & {
  type: ColumnType.Date
}

type ProgressColumn = Column & {
  type: ColumnType.Progress
}

type ButtonColumn = Column & {
  type: ColumnType.Button
  refTitle?: string // when set, take button title from respective row field
  buttonType?: TbButtonType
}

type ToggleColumn = Column & {
  type: ColumnType.Toggle
  selected?: boolean
}

export enum IconType {
  TbIcon = "icon",
  TbIconName = "iconName",
  SVG = "svg",
  ReactComponent = "react",
}

type IconColumn = Column & {
  type: ColumnType.Icon
  iconType: IconType
}

export enum Status {
  Pending = "pending",
  Scheduled = "scheduled",
  Executing = "executing",
  Succeeded = "succeeded",
  Failed = "failed",
  Error = "error",
  Unknown = "unknown",
}

type StatusColumn = Column & {
  type: ColumnType.Status
  //status: Status;
}

type HiddenColumn = Column & {
  type: ColumnType.Hidden
}

export type GenericColumn =
  | StringColumn
  | NumberColumn
  | BooleanColumn
  | DateColumn
  | ProgressColumn
  | ButtonColumn
  | ToggleColumn
  | IconColumn
  | StatusColumn
  | HiddenColumn

export type DetailEvent<T = DEF_ROW_TYPE> = {
  row: Row<T>
}

export type ShowDetailEvent<T = DEF_ROW_TYPE> = DetailEvent<T>
export type HideDetailEvent<T = DEF_ROW_TYPE> = DetailEvent<T>
export type ButtonEvent<T = DEF_ROW_TYPE> = {
  label: string
  row: Row<T>
}
export type ToggleEvent<T = DEF_ROW_TYPE> = ButtonEvent<T> & {
  selected: boolean
}

export type PagingEvent = {
  offset: number
  recordsShowing: number
  nextPage: boolean // false for previous page
}

export type ComponentEvents = {
  onRowSelect: RowSelectEvent
  onColumnSort: ColSortEvent
  onShowDetail: ShowDetailEvent
  onHideDetail: HideDetailEvent
  onButtonClicked: ButtonEvent
  onCheckboxClicked: ToggleEvent

  onNextPage: PagingEvent
  onPrevPage: PagingEvent
}

type ExtColumnT = GenericColumn | DetailColumnT

export const Component = (
  props: PiCardProps<ComponentProps, ComponentEvents>,
): React.ReactNode => {
  const {
    columns = [],
    data = [],
    rowSelectionActionMapper: rowSelectionActionTemplate,
    showDetailActionMapper: showDetailActionTemplate,

    dataFormatter = {},
    hasDetails,
    manageDetails,
    showLimit = 10,
    dataOffset = 0,
    hasMore,
    recordCount = -1,
    showSearch,
    showPageSizeSelector,
    showFooter = true,
    cardOnEmpty,
    onRowSelect,
    onColumnSort,
    onShowDetail,
    onHideDetail,
    onButtonClicked,
    onCheckboxClicked,
    onNextPage,
    onPrevPage: onPreviousPage,
    cardName,
    _dispatch,
  } = props
  const [showingDetail, setShowingDetail] = React.useState<
    Set<string | number>
  >(new Set<string | number>())

  const cls = (n: string) => props._cls(n, styles)
  const cols: ExtColumnT[] = hasDetails ? [DetailColumn, ...columns] : columns
  const visibleCols = cols.filter((c) => c.type !== ColumnType.Hidden)

  function rowClicked(row: Row): void {
    if (hasDetails) {
      toggleDetails(row)
    } else if (rowSelectionActionTemplate) {
      _dispatch(rowSelectionActionTemplate(row))
    } else {
      onRowSelect({ row })
    }
  }

  function sortClicked(
    col: Column,
    ev: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): void {
    const t = ev.target as HTMLButtonElement
    const cls = t.className
    const isAscending = cls.includes("asc")
    onColumnSort({ isAscending, col })
  }

  function isDetailShowing(row: Row): boolean {
    if (manageDetails) {
      return showingDetail.has(row.id)
    } else {
      return row.detailCard != null
    }
  }

  function detailsIconClicked(row: Row, ev: React.MouseEvent): void {
    toggleDetails(row)
    ev.stopPropagation()
  }

  function buttonClicked(row: Row, column: Column, ev: React.MouseEvent): void {
    onButtonClicked({ label: column.label, row })
    ev.stopPropagation()
  }

  function checkboxClicked(
    selected: boolean,
    row: Row,
    column: Column,
    ev: React.MouseEvent,
  ): void {
    onCheckboxClicked({ label: column.label, row, selected })
    ev.stopPropagation()
  }

  function toggleDetails(row: Row): void {
    if (isDetailShowing(row)) {
      // hide detail
      if (manageDetails) {
        showingDetail.delete(row.id)
        setShowingDetail(new Set(showingDetail))
      }
      onHideDetail({ row })
    } else {
      // show detail
      if (manageDetails) {
        showingDetail.add(row.id)
        setShowingDetail(new Set(showingDetail))
      }
      if (showDetailActionTemplate) {
        _dispatch(showDetailActionTemplate(row))
      } else {
        onShowDetail({ row })
      }
    }
  }

  function renderHeader(): React.ReactNode {
    if (!(showSearch || showPageSizeSelector)) return null

    return (
      <div className="card-body border-bottom py-3">
        <div className="row">
          <div className="col">{renderSearch()}</div>
          <div className="col-auto d-flex">{renderPageSizeSelector()}</div>
        </div>
      </div>
    )
  }

  function renderSearch(): React.ReactNode {
    if (!showSearch) return null

    return (
      <div className="ms-auto text-muted">
        Search:
        <div className="ms-2 d-inline-block">
          <input
            type="text"
            className="form-control form-control-sm"
            aria-label="Search invoice"
          />
        </div>
      </div>
    )
  }

  function renderPageSizeSelector(): React.ReactNode {
    if (!showPageSizeSelector) return null
    return (
      <div className="text-muted">
        Show
        <div className="mx-2 d-inline-block">
          <input
            type="text"
            className="form-control form-control-sm"
            value={showLimit}
            size={3}
            aria-label="Invoices count"
          />
        </div>
        entries
      </div>
    )
  }

  function renderTable(): React.ReactNode {
    return (
      <table className={`table table-hover pi-table`}>
        <thead>
          <tr>{visibleCols.map(renderColumnHeader)}</tr>
        </thead>
        <tbody className="table-tbody">{renderTableContent()}</tbody>
      </table>
    )
  }

  function renderTableContent(): React.ReactNode {
    if (data.length === 0 && cardOnEmpty) {
      return renderCardOnEmpty(cardOnEmpty)
    }
    return data.map(renderRow)
  }

  function renderColumnHeader(col: ExtColumnT, idx: number): React.ReactNode {
    const cls = `pi-th pi-th-${col.label} pi-th-${col.type || ColumnType.String
      }`

    return (
      <th key={idx} style={col.headerStyle || {}} className={cls}>
        {col.sortable && (
          <button
            className="table-sort"
            onClick={(el): void => sortClicked(col, el)}
            data-sort={`sort-${col.label}`}
          >
            {col.title}
          </button>
        )}
        {!col.sortable ? col.title : null}
      </th>
    )
  }

  function getColValue(name: string, row: Row): any {
    const d = row.data as { [k: string]: any }
    return d[name]
  }

  function renderRow(row: Row, idx: number): React.ReactNode {
    return (
      <React.Fragment key={row.id || idx}>
        <tr
          className={`pi-tr pi-tr-${row.id}`}
          onClick={(): void => rowClicked(row)}
        >
          {visibleCols.map((c, idx) =>
            renderCell(getColValue(c.label, row), c, row, idx),
          )}
        </tr>
        {renderDetailCard(row, idx)}
      </React.Fragment>
    )
  }

  function renderCell(
    value: unknown,
    col: ExtColumnT,
    row: Row,
    idx: number,
  ): React.ReactNode {
    if (col.type === ColumnType._Detail) {
      return renderDetailsIcon(row, idx)
    }
    const f = col.type ? dataFormatter[col.type] : undefined
    if (f) {
      value = f(value, col)
    } else {
      if (value && col.type === ColumnType.Progress) {
        return renderProgressBar(value as number, col, idx)
      }
      if (col.type === ColumnType.Button) {
        return renderButton(col, row, idx)
      }
      if (col.type === ColumnType.Toggle) {
        return renderToggle(!!value, col, row, idx)
      }
      if (col.type === ColumnType.Icon) {
        return renderIcon(value, col, idx)
      }
      if (col.type === ColumnType.Status) {
        return renderStatus(value, col, idx)
      }
    }
    return (
      <td
        key={idx}
        className={`sort-${col.label} pi-td pi-td-${col.label}`}
      >{`${value}`}</td>
    )
  }

  function renderDetailsIcon(row: Row, idx: number): React.ReactNode {
    const icon = isDetailShowing(row) ? <IconCaretDown /> : <IconCaretRight />
    return (
      <td key={idx} className={`pi-th pi-td-details-caret`}>
        {row.detailCard && (
          <button
            className="btn btn-icon pi-td-details-caret"
            onClick={(ev): void => detailsIconClicked(row, ev)}
          >
            {icon}
          </button>
        )}
      </td>
    )
  }

  function renderProgressBar(
    v: number,
    col: Column,
    idx: number,
  ): React.ReactNode {
    return (
      <td className={`sort-${col.label}`} data-progress={v} key={idx}>
        <div className="row align-items-center">
          <div className="col-12 col-lg-auto">{v}%</div>
          <div className="col">
            <div className="progress" style={{ width: "5rem" }}>
              {/* <div className="progress-bar" style={{ width: '30%' }} role="progressbar" aria-valuenow="30" aria-valuemin="0" aria-valuemax="100" aria-label="30% Complete"> */}
              <div
                className="progress-bar"
                style={{ width: `${v}%` }}
                role="progressbar"
                aria-label={`${v}% Complete`}
              >
                <span className="visually-hidden">{`${v}% Complete`}</span>
              </div>
            </div>
          </div>
        </div>
      </td>
    )
  }

  function renderButton(
    col: ButtonColumn,
    row: Row,
    idx: number,
  ): React.ReactNode {
    const cls = [
      "pi-tb-datatable-button",
      `pi-tb-datatable-button-${col.label}`,
      `pi-tb-datatable-button-${col.label}-${cardName}`,
      "btn",
      `btn-${col.buttonType ? col.buttonType : TbButtonType.Primary}`,
    ]
    const title = col.refTitle ? getColValue(col.refTitle, row) : col.title
    return (
      <td key={idx} className={`pi-th pi-td-button`}>
        <button
          onClick={(ev): void => buttonClicked(row, col, ev)}
          className={`${cls.join(" ")}`}
        >
          {title || "???"}
        </button>
      </td>
    )
  }

  function renderToggle(
    selected: boolean,
    col: ToggleColumn,
    row: Row,
    idx: number,
  ): React.ReactNode {
    const checked = selected
    return (
      <td
        key={idx}
        className={`pi-th pi-td-toggle pi-tb-datatable-toggle pi-tb-datatable-toggle-${col.label}`}
      >
        <label className="form-check m-0">
          <input
            onClick={(ev): void => checkboxClicked(!checked, row, col, ev)}
            type="checkbox"
            checked={checked}
            className="form-check-input position-static"
          />
        </label>
      </td>
    )
  }

  function renderIcon(
    value: unknown,
    col: IconColumn,
    idx: number,
  ): React.ReactNode {
    return (
      <td
        key={idx}
        className={`pi-th pi-td-icon pi-tb-datatable-icon pi-tb-datatable-icon-${col.label}`}
      >
        {renderIconInner(value, col.iconType)}
      </td>
    )
  }

  function renderIconInner(
    value: unknown,
    iconType: IconType,
  ): React.ReactNode {
    if (!value) return null

    switch (iconType) {
      case IconType.TbIconName:
        return <TbIcon iconName={value as string} />
      case IconType.TbIcon:
        return React.createElement(value as Icon)
      case IconType.SVG:
        return <img src={value as string} alt="Icon" />
      case IconType.ReactComponent:
        return (value as () => React.ReactNode)()
      default:
        return null
    }
  }

  function renderStatus(
    value: unknown,
    col: StatusColumn,
    idx: number,
  ): React.ReactNode {
    const style = {
      // paddingTop: 0,
      paddingBottom: 0,
      verticalAlign: "top",
    }
    const cls = `pi-th pi-td-status pi-td-status-${value} pi-tb-datatable-status pi-tb-datatable-status-${col.label}`
    return (
      <td key={idx} className={cls} style={style}>
        {renderStatusInner(value as Status)}
      </td>
    )
  }

  function renderStatusInner(status: Status): React.ReactNode {
    if (!status) return null
    const size = "24px"
    switch (status) {
      case Status.Succeeded:
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 18 18"
            preserveAspectRatio="xMidYMid meet"
            focusable="false"
          >
            <path
              d="M9 2C5.136 2 2 5.136 2 9s3.136 7 7 7 7-3.136 7-7-3.136-7-7-7zM7.6 12.5L4.1 9l.987-.987L7.6 10.52l5.313-5.314.987.994-6.3 6.3z"
              fill="#0F9D58"
              fill-rule="evenodd"
            />
          </svg>
        )
      case Status.Error:
      case Status.Failed:
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 18 18"
            preserveAspectRatio="xMidYMid meet"
            focusable="false"
          >
            <path
              d="M9 2a7 7 0 1 1 0 14A7 7 0 0 1 9 2zm-1 8h2V5H8v5zm0 3h2v-2H8v2z"
              fill="#D50000"
              fill-rule="evenodd"
            />
          </svg>
        )
      case Status.Pending:
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 48 48"
            fill="#8A8A8A"
            preserveAspectRatio="xMidYMid meet"
            focusable="false"
          >
            <path d="M0 0h48v48H0z" fill="none" />
            <path d="M32.49 15.51C30.14 13.17 27.07 12 24 12v12l-8.49 8.49c4.69 4.69 12.28 4.69 16.97 0 4.69-4.69 4.69-12.29.01-16.98zM24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.96 20-20c0-11.05-8.95-20-20-20zm0 36c-8.84 0-16-7.16-16-16S15.16 8 24 8s16 7.16 16 16-7.16 16-16 16z" />
          </svg>
        )
      case Status.Executing:
        return ThreeDotsBounce(18)
      default:
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 48 48"
            fill="#8A8A8A"
            preserveAspectRatio="xMidYMid meet"
            focusable="false"
          >
            <path d="M0 0h48v48H0z" fill="none" />
            <path d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.96 20-20c0-11.05-8.95-20-20-20zm0 36c-8.84 0-16-7.16-16-16S15.16 8 24 8s16 7.16 16 16-7.16 16-16 16z" />
          </svg>
        )
    }
  }

  function renderDetailCard(row: Row, idx: number): React.ReactNode {
    if (row.detailCard == null || !isDetailShowing(row)) return null

    return (
      <tr
        className={`pi-tb-datatable-tr-detail pi-pi-tb-datatable-tr-detail-${row.detailCard}`}
        key={`${row.id || idx}-detail`}
      >
        <td colSpan={100}>
          <Card cardName={row.detailCard} cardKey={row.id} row={row} />
        </td>
      </tr>
    )
  }

  function renderCardOnEmpty(cardName: PiCardRef): React.ReactNode {
    return (
      <tr
        className={`pi-tb-datatable-tr-empty-card pi-tb-datatable-tr-empty-card-${cardName}`}
      >
        <td colSpan={100}>
          <Card cardName={cardName} />
        </td>
      </tr>
    )
  }

  function renderFooter(): React.ReactNode {
    if (!showFooter) return null
    // if (recordCount <= 0) {
    //   // don't show footer if we don't know how many records there are
    //   return null
    // }

    const from = dataOffset + 1
    const to = dataOffset + data.length
    const totalF = (): React.ReactNode => {
      if (recordCount < 0) {
        return null
      } else {
        return (
          <>
            &nbsp;of <span>{recordCount}</span>
          </>
        )
      }
    }
    return (
      <div className="card-footer d-flex align-items-center">
        <p className="m-0 text-muted">
          Showing <span>{from}</span> to <span>{to}</span>
          {totalF()}&nbsp;entries
        </p>
        <ul className="pagination m-0 ms-auto">
          {renderPrevPage()}
          {renderPages()}
          {renderNextPage()}
        </ul>
      </div>
    )
  }

  function renderPages(): React.ReactNode {
    if (recordCount < 0) return null

    const pages = recordCount > 0 ? Math.ceil(recordCount / showLimit) : -1
    return (
      <>
        <li key={0} className="page-item">
          <a className="page-link" href="#">
            1
          </a>
        </li>
        <li key={1} className="page-item active">
          <a className="page-link" href="#">
            2
          </a>
        </li>
        <li key={2} className="page-item">
          <a className="page-link" href="#">
            3
          </a>
        </li>
        <li key={3} className="page-item">
          <a className="page-link" href="#">
            4
          </a>
        </li>
        <li key={4} className="page-item">
          <a className="page-link" href="#">
            5
          </a>
        </li>
      </>
    )
  }

  function renderPrevPage(): React.ReactNode {
    const disabled = dataOffset === 0

    return (
      <li
        className={disabled ? "page-item disabled" : "page-item"}
        key="prev-page"
      >
        <button
          className="page-link"
          onClick={(): void => onPaging(false)}
          aria-disabled={disabled}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <polyline points="15 6 9 12 15 18" />
          </svg>
          prev
        </button>
      </li>
    )
  }

  function renderNextPage(): React.ReactNode {
    const disabled = !hasMore
    return (
      <li
        className={disabled ? "page-item disabled" : "page-item"}
        key="next-page"
      >
        <button
          className="page-link"
          onClick={(): void => onPaging(true)}
          aria-disabled={disabled}
        >
          next
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <polyline points="9 6 15 12 9 18" />
          </svg>
        </button>
      </li>
    )
  }

  function onPaging(nextPage: boolean): void {
    const ev: PagingEvent = {
      offset: dataOffset,
      recordsShowing: data.length,
      nextPage,
    }
    nextPage ? onNextPage(ev) : onPreviousPage(ev)
  }

  //   function renderShowingRecordCount() {
  //     if true {
  //       return (Showing < span > { from }</span > to < span > { to }</span > { totalF() } & nbsp;entries)
  // )
  //     }
  //   }

  return (
    <div
      className={`pi-tb-datatable pi-tb-datatable-${cardName}`}
      data-pihanga={cardName}
    >
      {renderHeader()}
      <div id="table-default" className="table-responsive">
        {renderTable()}
      </div>
      {renderFooter()}
    </div>
  )
}

// Source: https://github.com/n3r4zzurr0/svg-spinners/blob/main/svg-css/3-dots-bounce.svg
// Converted with: https://react-svgr.com/
export const ThreeDotsBounce = (size: number = 24): React.ReactNode => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size * 1.5} height={size}>
      <style>
        {
          "@keyframes spinner_8HQG{0%,57.14%{animation-timing-function:cubic-bezier(.33,.66,.66,1);transform:translate(0)}28.57%{animation-timing-function:cubic-bezier(.33,0,.66,.33);transform:translateY(-6px)}to{transform:translate(0)}}.spinner_qM83{animation:spinner_8HQG 1.05s infinite}"
        }
      </style>
      <circle cx={4} cy={12} r={3} className="spinner_qM83" />
      <circle
        cx={12}
        cy={12}
        r={3}
        className="spinner_qM83"
        style={{
          animationDelay: ".1s",
        }}
      />
      <circle
        cx={20}
        cy={12}
        r={3}
        className="spinner_qM83"
        style={{
          animationDelay: ".2s",
        }}
      />
    </svg>
  )
}
