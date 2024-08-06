import React from "react"
import { PiCardProps } from "@pihanga2/core"
import { ListEvents, Item, ListProps } from "@pihanga2/cards"
import {
  List,
  ListItem,
  ListItemButton,
  ListItemContent,
  ListItemDecorator,
  Theme,
  Typography,
} from "@mui/joy"
import { Toggler } from "./toggler.component"
import { registerMuiIcon } from "../icons"
import { renderDecorator } from "../utils"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import { DecoratorE, IconDecoratorT } from "@pihanga2/cards"
import { SxProps } from "@mui/joy/styles/types"

export const NESTED_ICON_NAME = registerMuiIcon(KeyboardArrowDownIcon)

export type ComponentProps = ListProps & {
  joy?: {
    sx?: {
      root?: SxProps
    }
  }
}

type SelectableItem = Item & {
  onSelect: () => void
}

export const DEF_ROOT_SX: SxProps = {
  gap: 1,
  "--List-nestedInsetStart": "30px",
  "--ListItem-radius": (theme: Theme) => theme.vars.radius.sm,
}

export const Component = (
  props: PiCardProps<ComponentProps, ListEvents>,
): React.ReactNode => {
  const { items, marker, size, onItemClicked, joy, cardName } = props

  function renderItem(it: Item, idx: number): React.ReactNode {
    if (it.nested) {
      return renderNestedItem(it, idx)
    } else {
      return renderSingleItem(it, idx)
    }
  }

  function renderSingleItem(item: Item, idx: number): React.ReactNode {
    const it = {
      ...item,
      onSelect: () => onItemClicked({ itemID: item.id }),
    }
    return <ListItem key={it.id || idx}>{renderItemButton(it)}</ListItem>
  }

  function renderItemButton(it: SelectableItem): React.ReactNode {
    return (
      <ListItemButton onClick={it.onSelect}>
        {renderStartDecorator(it)}
        {renderContent(it)}
        {renderDecorator(it.endDecorator, cardName)}
      </ListItemButton>
    )
  }

  function renderNestedItem(it: Item, idx: number, onClick?: () => void) {
    return (
      <ListItem key={it.id || idx} nested>
        <Toggler
          renderToggle={({ open, setOpen }) => {
            const endDecorator: IconDecoratorT & { sx: SxProps } = {
              type: DecoratorE.Icon,
              icon: NESTED_ICON_NAME,
              sx: { transform: open ? "rotate(180deg)" : "none" },
            }
            const its: SelectableItem = {
              endDecorator,
              ...it,
              onSelect: () => setOpen(!open),
            }
            return renderItemButton(its)
          }}
        >
          <List sx={{ gap: 0.5 }}>
            {it.nested?.map((it, idx) => {
              const its: Item = {
                titleLevel: "body-sm",
                ...it,
              }
              return renderItem(its, idx)
            })}
          </List>
        </Toggler>
      </ListItem>
    )
  }

  function renderStartDecorator(it: Item) {
    if (!it.startDecorator) return null

    return (
      <ListItemDecorator>
        {renderDecorator(it.startDecorator, cardName)}
      </ListItemDecorator>
    )
  }

  function renderContent(it: Item) {
    return (
      <ListItemContent>
        <Typography level={it.titleLevel || "title-sm"}>{it.title}</Typography>
        {it.subTitle && (
          <Typography level={it.subTitleLevel || "body-sm"} noWrap>
            {it.subTitle}
          </Typography>
        )}
      </ListItemContent>
    )
  }

  // role="menubar" orientation="horizontal"
  return (
    <List
      size={size || "sm"}
      //component={component}
      marker={marker}
      sx={joy?.sx?.root || DEF_ROOT_SX}
      data-pihanga={cardName}
    >
      {items.map(renderItem)}
    </List>
  )
}
