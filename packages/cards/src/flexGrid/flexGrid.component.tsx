import React from "react"
import { Card, PiCardProps, PiCardRef } from "@pihanga2/core"
import { FlexGridProps } from "./flexGrid.types"
import clsx from "clsx"

export const FlexGridComponent = (
  props: PiCardProps<FlexGridProps>,
): React.ReactNode => {
  const {
    cardName,
    cards = {},
    template,
    height = "auto", //'100vh',
    margin = 0,
    overflow = "hidden", // 'scroll',
    style,
    className,
    _cls,
  } = props

  const areaRows = template.area.map((rn) => `"${rn.join(" ")}"`)
  const area = areaRows.join(" ")
  // console.log("AREA", area)
  const _style = {
    display: "grid",
    gridTemplateAreas: area,
    gridTemplateRows: template.rows.join(" "),
    gridTemplateColumns: template.columns.join(" "),
    gridGap: template.gap || "10px",
    height,
    margin,
    width: "100%",
    ...style?.root,
  }

  function renderGridCard(v: [string, PiCardRef]): JSX.Element {
    const [name, gridCard] = v
    const _style = {
      gridArea: name,
      overflow,
      ...style?.item,
    }
    return (
      <div style={_style} key={name}>
        <Card cardName={gridCard} parentCard={cardName} />
      </div>
    )
  }

  return (
    <div
      style={_style}
      className={clsx(_cls("root"), className)}
      data-pihanga={cardName}
    >
      {Object.entries(cards).map(renderGridCard)}
    </div>
  )
}
