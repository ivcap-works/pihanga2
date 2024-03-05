import React, { Fragment } from "react"
import { SxProps } from "@mui/material"
import { Card, PiCardProps } from "@pihanga2/core"
import {
  CardEl,
  CheckboxEl,
  DataGridEvents,
  DataGridProps,
  ButtonEl,
  DataGridElTypeE,
  DateEl,
  InputEl,
  LinkEl,
  StatusEl,
  TextEl,
  TitledDataGridEl,
  DEF_DATE_FORMATTER,
} from "@pihanga2/cards/src/dataGrid"
import { Box, Divider, Typography, styled } from "@mui/joy"
import { Component as ButtonComponent } from "../button/button.component"
import { Component as LinkComponent } from "../link/link.component"
import { TypographyComponent } from "../typography/typography.component"
import { ButtonProps } from "@pihanga2/cards/src/button"

type ComponentProps = DataGridProps & {
  joy?: {
    sx?: {
      root?: SxProps
      grid?: SxProps
      divider?: SxProps
      item?: {
        root?: SxProps
        title?: SxProps
      }
    }
  }
}

export type SxElement = {
  joy?: {
    sx?: {
      root: SxProps
      title: SxProps
    }
  }
}

const Grid = styled("div")({
  gridTemplateColumns: "repeat(auto-fit,minmax(12rem,1fr))",
  gridGap: "1rem",
  display: "grid",
})

export const DEF_SX = {
  root: {},
  grid: {
    // gridTemplateColumns: "repeat(auto-fit,minmax(12rem,1fr))",
    // gridGap: "1rem",
    // display: "grid",
  },
  divider: {
    marginTop: "1em",
    marginBottom: "1em",
  },
  item: {
    root: {
      width: "15rem",
    },
    title: {
      fontSize: ".625rem",
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: ".04em",
      lineHeight: "1rem",
      color: "#6c7a91",
      marginBottom: "0.25rem",
    },
  },
}

export const Component = (
  props: PiCardProps<ComponentProps, DataGridEvents>,
): React.ReactNode => {
  const {
    data,
    items,
    dateFormatter = DEF_DATE_FORMATTER.format,
    cardOnEmpty,
    onButtonClicked,
    onLinkClicked,
    joy,
    cardName,
    _dispatch,
    _cls,
  } = props
  const cls = (...n: string[]) => props._cls(n[0])

  if (cardOnEmpty && items.length === 0) {
    return (
      <div className={cls("empty")}>
        <Card cardName={cardOnEmpty} parentCard={cardName} />
      </div>
    )
  }

  function renderText(el: TextEl): React.ReactNode {
    const p = {
      text: data[el.id],
      ...el,
      cardName: `${cardName}/${el.id}`,
      _cls,
      _dispatch,
    }
    return (
      <div
        className={_cls("link")}
        style={el.style ? el.style.value : undefined}
        key={el.id}
      >
        {TypographyComponent(p)}
      </div>
    )
  }

  function renderLink(el: LinkEl): React.ReactNode {
    const onClicked = () => {
      if (el.actionMapper) {
        const a = el.actionMapper(el)
        _dispatch(a)
      } else {
        onLinkClicked({ linkID: el.id })
      }
    }
    const p = {
      ...el,
      cardName: `${cardName}/${el.id}`,
      onClicked,
      _cls,
      _dispatch,
    }
    return (
      <div
        className={_cls("link")}
        style={el.style ? el.style.value : undefined}
        key={el.id}
      >
        {LinkComponent(p)}
      </div>
    )
  }

  function renderDate(el: DateEl): React.ReactNode {
    let v = data[el.id] || "-"
    if (v instanceof Date) {
      v = dateFormatter(v)
    }
    return renderText({ ...el, type: DataGridElTypeE.Text, text: v })
  }

  function renderStatus(el: StatusEl): React.ReactNode {
    const v = data[el.id]
    return (
      <div
        className={cls("content", "content-status")}
        style={el.style ? el.style.value : undefined}
        key={el.id}
      >
        <span className={`status status-${el.statusColor}`}>{v}</span>
      </div>
    )
  }

  function renderCheckbox(el: CheckboxEl): React.ReactNode {
    const v = data[el.id]
    return (
      <div
        className={cls("content", "content-checkbox")}
        style={el.style ? el.style.value : undefined}
        key={el.id}
      >
        <label className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            checked={el.checked}
          />
          <span className="form-check-label">{v}</span>
        </label>
      </div>
    )
  }

  function renderInput(el: InputEl): React.ReactNode {
    return (
      <div
        className={cls("content", "content-input")}
        style={el.style ? el.style.value : undefined}
        key={el.id}
      >
        <input
          type="text"
          className="form-control form-control-flush"
          placeholder={el.placeHolder}
        />
      </div>
    )
  }

  function renderButton(el: ButtonEl): React.ReactNode {
    // const btn_cls = `btn btn-${el.buttonType || TbButtonType.Primary}`
    const onClicked = () => {
      if (el.actionMapper) {
        const a = el.actionMapper(el)
        _dispatch(a)
      } else {
        onButtonClicked({ buttonID: el.id })
      }
    }
    const p = {
      ...el,
      cardName: `${cardName}.${el.id}`,
      onClicked,
      _cls,
      _dispatch,
    }
    return (
      <div
        className={cls("content", "content-button")}
        style={el.style ? el.style.value : undefined}
        key={el.id}
      >
        {ButtonComponent(p)}
      </div>
    )
  }

  function renderCard(el: CardEl): React.ReactNode {
    return (
      <div
        className={cls("content", "content-input")}
        style={el.style ? el.style.value : undefined}
        key="el.id"
      >
        <Card
          cardName={el.cardName}
          cardKey={el.id}
          {...el.context}
          parentCard={cardName}
        />
      </div>
    )
  }

  function renderItemContent(el: TitledDataGridEl): React.ReactNode {
    switch (el.type) {
      case DataGridElTypeE.Text:
        return renderText(el)
      case DataGridElTypeE.Link:
        return renderLink(el)
      case DataGridElTypeE.Date:
        return renderDate(el)
      case DataGridElTypeE.Checkbox:
        return renderCheckbox(el)
      case DataGridElTypeE.Input:
        return renderInput(el)
      case DataGridElTypeE.Status:
        return renderStatus(el)
      case DataGridElTypeE.Button:
        return renderButton(el)
      case DataGridElTypeE.Card:
        return renderCard(el)
      default:
        return (
          <div className={cls("content", "content-unknown")} key="unknown">
            ERROR: Unknown type '{el}'
          </div>
        )
    }
  }

  function renderItem(el: TitledDataGridEl, idx: number): React.ReactNode {
    const title = el.title || camelToWords(el.id)
    const sx = (el as SxElement).joy?.sx
    if ("id" in el) {
      return (
        <Box
          className={_cls(["item", `item-${el.type}`, `item-${el.id}`])}
          sx={sx?.root || joy?.sx?.item?.root || DEF_SX.item.root}
          style={el.style ? el.style.root : undefined}
          key={idx}
        >
          {title !== "-" && !el.hideTitle && (
            <Typography
              level="title-sm"
              className={cls("grid-item-title")}
              sx={sx?.title || joy?.sx?.item?.title || DEF_SX.item.title}
              style={el.style ? el.style.title : undefined}
            >
              {title}
            </Typography>
          )}
          {renderItemContent(el)}
        </Box>
      )
    } else {
      return (
        <div className={_cls(["item", "item-unknown"])} key={idx}>
          {renderItemContent(el)}
        </div>
      )
    }
  }

  function renderGrid(items: TitledDataGridEl[], idx: number): React.ReactNode {
    return (
      <Fragment key={idx}>
        {idx > 0 && <Divider sx={joy?.sx?.divider || DEF_SX.divider} />}
        <Grid sx={joy?.sx?.grid || DEF_SX.grid} className={cls("grid")}>
          {items.map(renderItem)}
        </Grid>
      </Fragment>
    )
  }

  function renderContent(): React.ReactNode {
    const groups = items.reduce(
      (p, el) => {
        if (el.type === DataGridElTypeE.Separator) {
          p.push([])
        } else {
          p[p.length - 1].push(el)
        }
        return p
      },
      [[]] as TitledDataGridEl[][],
    )
    return groups.map(renderGrid)
  }

  return (
    <Box
      sx={joy?.sx?.root || DEF_SX.root}
      className={_cls("root")}
      data-pihanga={cardName}
    >
      {renderContent()}
    </Box>
  )
}

function camelToWords(s: string): string {
  return s
    .replace(/((?<!^)[A-Z](?![A-Z]))(?=\S)/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
}
