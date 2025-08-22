import React from "react"
import { Card, isCardRef, PiCardProps } from "@pihanga2/core"
import { TabsEvents, TabsProps, TabT } from "@pihanga2/cards"
import Tabs from "@mui/joy/Tabs"
import { renderDecorator } from "../utils"
import { DEF_SX, TabsSX } from "./tabs.sx"
import TabList from "@mui/joy/TabList"
import Tab from "@mui/joy/Tab"
import TabPanel from "@mui/joy/TabPanel"

export const Component = (
  props: PiCardProps<TabsProps, TabsEvents>,
): React.ReactNode => {
  const {
    tabs,
    value,
    defaultValue,
    color,
    disabled,
    disableUnderline,
    underlinePlacement,
    tabFlex,
    selectionFollowsFocus,
    orientation,
    variant,
    size,
    sticky,
    ariaLabel,

    style,
    className,
    onChange,
    cardName,
    _cls,
  } = props

  let sx: TabsSX = style?.joy || {}

  function onChangeHandler(ev: unknown, value: string | number | null) {
    onChange({ tabID: `${value || ""}` })
  }

  function renderTab(tab: TabT) {
    const p = {
      color: tab.color,
      disabled: tab.disabled,
      disableIndicator: tab.disableIndicator,
      indicatorInset: tab.indicatorInset,
      indicatorPlacement: tab.indicatorPlacement,
      size: tab.size,
      variant: tab.variant,
      sx: { ...DEF_SX.tab, ...sx.tab },
    }
    return (
      <Tab value={tab.id} {...p} key={tab.id}>
        {isCardRef(tab.title) ? (
          <Card cardName={tab.title} parentCard={cardName} />
        ) : (
          (tab.title as string)
        )}
      </Tab>
    )
  }

  function renderPanel(tab: TabT) {
    const _sx = { ...DEF_SX.panel, ...sx.panel }

    return (
      <TabPanel value={tab.id} sx={_sx} key={tab.id}>
        <Card cardName={tab.content} parentCard={cardName} />
      </TabPanel>
    )
  }

  const tabP = {
    value,
    defaultValue,
    color,
    orientation,
    selectionFollowsFocus,
    size,
    variant,
    sx: sx.root,
  }

  const tabListP = {
    color,
    size,
    disabled,
    disableUnderline,
    sticky,
    tabFlex,
    underlinePlacement,
    variant,
  }
  return (
    <Tabs
      aria-label={ariaLabel}
      {...tabP}
      onChange={onChangeHandler}
      className={className}
      data-pihanga={cardName}
    >
      <TabList {...tabListP}>{tabs.map(renderTab)}</TabList>
      {tabs.map(renderPanel)}
    </Tabs>
  )
}
