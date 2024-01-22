import React from "react"
import { ColorPaletteProp } from "@mui/joy/styles"
import Box from "@mui/joy/Box"
import Chip from "@mui/joy/Chip"
import Link from "@mui/joy/Link"
import Table from "@mui/joy/Table"
import Sheet from "@mui/joy/Sheet"
import Checkbox from "@mui/joy/Checkbox"
import IconButton from "@mui/joy/IconButton"
import Typography from "@mui/joy/Typography"

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"

import { Card, PiCardProps, PiCardRef } from "@pihanga/core"
import {
  ChipColumn,
  TableColumn,
  TableColumnTypeE,
  TableEvents,
  TableProps,
  DetailColumn,
  DetailColumnT,
  GenericColumn,
  ProgressColumn,
  TableRow,
  ToggleColumn,
} from "@pihanga/cards/src/types/table"
import { SxProps } from "@mui/material"
import { renderDecorator } from "../utils"
import { LinearProgress } from "@mui/joy"

type ExtColumnT = GenericColumn | DetailColumnT
type Order = "asc" | "desc"

export type ComponentProps = TableProps & {
  joy?: {
    sx?: {
      root?: SxProps
      table?: SxProps
    }
  }
}

const DEF_SX = {
  root: {
    display: { xs: "none", sm: "initial" },
    width: "100%",
    borderRadius: "sm",
    flexShrink: 1,
    overflow: "auto",
    minHeight: 0,
  },
  table: {
    "--TableCell-headBackground": "var(--joy-palette-background-level1)",
    "--Table-headerUnderlineThickness": "1px",
    "--TableRow-hoverBackground": "var(--joy-palette-background-level1)",
    "--TableCell-paddingY": "4px",
    "--TableCell-paddingX": "8px",
  },
}

export const Component = (
  props: PiCardProps<ComponentProps, TableEvents>,
): React.ReactNode => {
  const {
    columns = [],
    data = [],
    // rowSelectionActionMapper: rowSelectionActionTemplate,
    // showDetailActionMapper: showDetailActionTemplate,

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
    onRowClicked,
    onColumnSort,
    onShowDetail,
    onHideDetail,
    onButtonClicked,
    onCheckboxClicked,
    onRowSelected,
    onAllRowsSelected,

    onNextPage,
    onPrevPage: onPreviousPage,
    sheetWrap,
    cardName,
    joy,
    _cls,
  } = props
  const [showingDetail, setShowingDetail] = React.useState<
    Set<string | number>
  >(new Set<string | number>())

  const [order, setOrder] = React.useState<Order>("desc")
  const [sortingColumn, setSortingColumn] = React.useState<string | null>(null)
  const [selected, setSelected] = React.useState<readonly string[]>([])
  const [open, setOpen] = React.useState(false)

  const cols: ExtColumnT[] = hasDetails ? [DetailColumn, ...columns] : columns
  const visibleCols = cols.filter((c) => c.type !== TableColumnTypeE.Hidden)

  // check if there is a sorting column. but none is defined - pick one
  if (!sortingColumn) {
    const sc = visibleCols.find((c) => c.sortable)
    if (sc) {
      onSortOrder(sc)
    }
  }

  function isDetailShowing(row: TableRow): boolean {
    if (manageDetails) {
      return showingDetail.has(row.id)
    } else {
      return row.detailCard != null
    }
  }

  function detailsIconClicked(row: TableRow, ev: React.MouseEvent): void {
    toggleDetails(row)
    ev.stopPropagation()
  }

  function rowClicked(row: TableRow): void {
    if (hasDetails) {
      toggleDetails(row)
    } else {
      onRowClicked({ row })
    }
  }

  function toggleDetails(row: TableRow): void {
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
      onShowDetail({ row })
    }
  }

  function onSortOrder(col: TableColumn) {
    let newOrder = order
    if (col.label === sortingColumn) {
      // already sorting, change order
      newOrder = order === "asc" ? "desc" : "asc"
      setOrder(newOrder)
    } else {
      // new sorting column
      setSortingColumn(col.label)
    }
    onColumnSort({
      isAscending: newOrder === "asc",
      col: col,
    })
  }

  // function onHeaderSelector() {

  // }

  function renderTable() {
    return (
      <Table
        aria-labelledby="tableTitle"
        stickyHeader
        hoverRow
        sx={joy?.sx?.table || DEF_SX.table}
      >
        <thead>
          <tr>{visibleCols.map(renderColumnHeader)}</tr>
        </thead>
        <tbody className="table-tbody">{renderTableContent()}</tbody>
      </Table>
    )
  }

  function renderColumnHeader(col: ExtColumnT, key: any): React.ReactNode {
    if (col.type === TableColumnTypeE._Detail) {
      return (
        <th
          key={key}
          style={col.headerStyle || { width: "32px" }}
          className={_cls(col.label)}
        />
      )
    }
    if (col.type === TableColumnTypeE.Toggle) {
      return (
        <th key={key} style={col.headerStyle || {}} className={_cls(col.label)}>
          {renderCheckbox(false, () => console.log(">>> ALL ROWS SELECTED"))}
        </th>
      )
    }
    return (
      <th key={key} style={col.headerStyle || {}} className={_cls(col.label)}>
        {col.sortable && (
          <Link
            underline="none"
            color="primary"
            component="button"
            onClick={() => onSortOrder(col)}
            fontWeight="lg"
            endDecorator={<ArrowDropDownIcon />}
            sx={getSortSX(col)}
          >
            {getTitle(col)}
          </Link>
        )}
        {!col.sortable ? getTitle(col) : null}
      </th>
    )
  }

  function renderTableContent(): React.ReactNode {
    if (data.length === 0 && cardOnEmpty) {
      return renderCardOnEmpty(cardOnEmpty, cardName)
    }
    return data.map(renderRow)
  }

  function renderRow(row: TableRow, idx: number): React.ReactNode {
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

  function getColValue(name: string, row: TableRow): any {
    const d = row.data as { [k: string]: any }
    return d[name]
  }

  function renderCell(
    value: unknown,
    col: ExtColumnT,
    row: TableRow,
    idx: number,
  ): React.ReactNode {
    if (col.type === TableColumnTypeE._Detail) {
      return renderDetailsIcon(row, idx)
    }
    const f = col.type ? dataFormatter[col.type] : undefined
    if (f) {
      value = f(value, col)
    } else {
      if (col.type === TableColumnTypeE.Progress) {
        const v = value ? (value as number) : 0
        return renderProgressBar(v, col, idx)
      }
      // if (col.type === ColumnType.Button) {
      //   return renderButton(col, row, idx)
      // }
      if (col.type === TableColumnTypeE.Chip) {
        return renderChip(value as string, col, idx)
      }

      if (col.type === TableColumnTypeE.Toggle) {
        return renderToggle(!!value, col, row, idx)
      }
      // if (col.type === ColumnType.Icon) {
      //   return renderIcon(value, col, idx)
      // }
      // if (col.type === ColumnType.Status) {
      //   return renderStatus(value, col, idx)
      // }
    }
    return (
      <td key={idx} className={_cls(["td-default", `td-default-${col.label}`])}>
        <Typography level="body-xs">{`${value}`}</Typography>
      </td>
    )
  }

  function renderDetailsIcon(row: TableRow, idx: number): React.ReactNode {
    const isShowing = isDetailShowing(row) // ? <IconCaretDown /> : <IconCaretRight />
    return (
      <td key={idx} className={`pi-th pi-td-details-caret`}>
        {row.detailCard && (
          <IconButton
            variant="plain"
            onClick={(ev): void => detailsIconClicked(row, ev)}
          >
            <ArrowDropDownIcon
              sx={{
                "&": {
                  transform: isShowing ? "rotate(0deg)" : "rotate(270deg)",
                },
              }}
            />
          </IconButton>
        )}
      </td>
    )
  }

  function renderToggle(
    selected: boolean,
    col: ToggleColumn,
    row: TableRow,
    idx: number,
  ): React.ReactNode {
    const on = (): void =>
      onCheckboxClicked({ label: col.label, row, selected })
    return (
      <td
        key={idx}
        style={{ textAlign: "center" }}
        className={_cls(["td-toggle", `td-toggle-${col.label}`])}
      >
        {renderCheckbox(selected, on)}
      </td>
    )
  }

  function renderProgressBar(
    value: number,
    col: ProgressColumn,
    idx: number,
  ): React.ReactNode {
    return (
      <td
        className={_cls(["td-progressbar", `td-progressbar-${col.label}`])}
        data-progress={value}
        key={idx}
      >
        <LinearProgress
          value={value}
          determinate
          color={col.color}
          variant={col.variant}
        />
        {/* <span className="visually-hidden">{`${value}% Complete`}</span> */}
      </td>
    )
  }

  function renderChip(value: string, col: ChipColumn<string>, idx: number) {
    const startDecorator = col.startDecorator
      ? col.startDecorator[value]
      : undefined
    return (
      <td
        className={_cls(["td-progressbar", `td-progressbar-${col.label}`])}
        key={idx}
      >
        <Chip
          variant="soft"
          size="sm"
          startDecorator={renderDecorator(startDecorator)}
          color={col.color ? (col.color[value] as ColorPaletteProp) : undefined}
        >
          {value}
        </Chip>
      </td>
    )
  }

  // function renderButton(
  //   col: ButtonColumn,
  //   row: Row,
  //   idx: number,
  // ): React.ReactNode {
  //   const cls = [
  //     "pi-tb-datatable-button",
  //     `pi-tb-datatable-button-${col.label}`,
  //     `pi-tb-datatable-button-${col.label}-${cardName}`,
  //     "btn",
  //     `btn-${col.buttonType ? col.buttonType : TbButtonType.Primary}`,
  //   ]
  //   const title = col.refTitle ? getColValue(col.refTitle, row) : col.title
  //   return (
  //     <td key={idx} className={`pi-th pi-td-button`}>
  //       <button
  //         onClick={(ev): void => buttonClicked(row, col, ev)}
  //         className={`${cls.join(" ")}`}
  //       >
  //         {title || "???"}
  //       </button>
  //     </td>
  //   )
  // }

  // function renderIcon(
  //   value: unknown,
  //   col: IconColumn,
  //   idx: number,
  // ): React.ReactNode {
  //   return (
  //     <td
  //       key={idx}
  //       className={`pi-th pi-td-icon pi-tb-datatable-icon pi-tb-datatable-icon-${col.label}`}
  //     >
  //       {renderIconInner(value, col.iconType)}
  //     </td>
  //   )
  // }

  function renderCheckbox(
    selected: boolean,
    onToggle: () => void,
  ): React.ReactNode {
    return (
      <Checkbox
        size="sm"
        // indeterminate={
        //   selected.length > 0 && selected.length !== rows.length
        // }
        checked={selected}
        onChange={(ev) => {
          onToggle()
          ev.stopPropagation()
        }}
        // onChange={(event) => {
        //   setSelected(event.target.checked ? data.map((row) => row.id) : [])
        // }}
        color={selected ? "primary" : undefined}
        slotProps={{ checkbox: { sx: { textAlign: "left" } } }}
        sx={{ verticalAlign: "text-bottom" }}
      />
    )
  }

  function getSortSX(col: ExtColumnT): SxProps {
    if (col.label === sortingColumn) {
      return {
        "& svg": {
          transition: "0.2s",
          transform: order === "desc" ? "rotate(0deg)" : "rotate(180deg)",
        },
      }
    } else {
      return {
        "&:hover svg": {
          display: "block",
        },
        "& svg": {
          transform: order === "desc" ? "rotate(0deg)" : "rotate(180deg)",
          display: "none",
        },
      }
    }
  }

  function getTitle(col: TableColumn) {
    if (col.title) {
      return col.title
    } else {
      const l = col.label
      return l.charAt(0).toLocaleUpperCase() + l.slice(1)
    }
  }

  // function renderChip() {
  //   return (
  //     <Chip
  //       variant="soft"
  //       size="sm"
  //       startDecorator={
  //         {
  //           Paid: <CheckRoundedIcon />,
  //           Refunded: <AutorenewRoundedIcon />,
  //           Cancelled: <BlockIcon />,
  //         }[row.status]
  //       }
  //       color={
  //         {
  //           Paid: "success",
  //           Refunded: "neutral",
  //           Cancelled: "danger",
  //         }[row.status] as ColorPaletteProp
  //       }
  //     >
  //       {row.status}
  //     </Chip>
  //   )
  // }
  // function renderText() {
  //   return (
  //     <Typography level="body-xs">{row.date}</Typography>

  //   )
  // }

  function renderDetailCard(row: TableRow, idx: number): React.ReactNode {
    if (row.detailCard == null || !isDetailShowing(row)) return null

    return (
      <tr
        className={`pi-tb-datatable-tr-detail pi-pi-tb-datatable-tr-detail-${row.detailCard}`}
        key={`${row.id || idx}-detail`}
      >
        <td colSpan={columns.length + 1}>
          <Card
            cardName={row.detailCard}
            cardKey={row.id}
            row={row}
            parentCard={cardName}
            key={`${cardName}-${row.id || idx}-detail`}
          />
        </td>
      </tr>
    )
  }

  function renderCardOnEmpty(
    cardName: PiCardRef,
    parentCard: string,
  ): React.ReactNode {
    return (
      <tr
        className={`pi-tb-datatable-tr-empty-card pi-tb-datatable-tr-empty-card-${cardName}`}
      >
        <td colSpan={100}>
          <Card cardName={cardName} parentCard={parentCard} />
        </td>
      </tr>
    )
  }

  const useSheet = !sheetWrap?.notUsed
  if (useSheet) {
    return (
      <Sheet
        variant={sheetWrap?.variant || "outlined"}
        sx={joy?.sx?.root || DEF_SX.root}
        className={_cls("root")}
        data-pihanga={cardName}
      >
        {renderTable()}
      </Sheet>
    )
  } else {
    return (
      <Box sx={joy?.sx?.root || DEF_SX.root} data-pihanga={cardName}>
        {renderTable()}
      </Box>
    )
  }
}
