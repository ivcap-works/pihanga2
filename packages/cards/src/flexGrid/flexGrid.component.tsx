import React from "react"
import { Card, PiCardProps } from "@pihanga2/core"
import { FlexGridProps } from "./flexGrid"

export const FlexGridComponent = (
  props: PiCardProps<FlexGridProps>,
): React.ReactNode => {
  const {
    cardName,
    cards = [],
    template,
    height = "auto", //'100vh',
    margin = 0,
    overflow = "hidden", // 'scroll',
  } = props

  const areaRows = template.area.map((rn) => {
    const r = rn.map((c) => `a${c}`)
    return `"${r.join(",")}"`
  })
  const area = areaRows.join(" ")
  // console.log("AREA", area)
  const style = {
    display: "grid",
    gridTemplateAreas: area,
    gridTemplateRows: template.rows.join(" "),
    gridTemplateColumns: template.columns.join(" "),
    gridGap: template.gap || "10px",
    height,
    margin,
    width: "100%",
  } // having type issues with gridTemplateXXX
  // console.log("STYLE", style)

  function renderGridCard(name: string, idx: number): JSX.Element {
    const style = {
      gridArea: `a${idx}`, // c2n[name],
      overflow,
    }
    return (
      <div style={style} key={idx}>
        <Card cardName={name} parentCard={cardName} />
      </div>
    )
  }

  function _cls(arg0: string): string | undefined {
    throw new Error("Function not implemented.")
  }

  return (
    <div style={style} className={_cls("root")} data-pihanga={cardName}>
      {cards.map(renderGridCard)}
    </div>
  )
}
