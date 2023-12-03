import React from "react"
import { Card, PiCardProps, PiCardRef } from "@pihanga/core"
//import styles from "./tbPage.module.css"

export type ComponentProps = {
  title?: string // only show when 'headerCard is not defined
  withTitleSeparator?: boolean // if false use 'card-header-light'
  contentCard: string
  headerLeftCards?: PiCardRef[]
  headerRightCards?: PiCardRef[]
  footerCard?: string
}

export const Component = (
  props: PiCardProps<ComponentProps>,
): React.ReactNode => {
  const {
    title,
    withTitleSeparator,
    contentCard,
    headerLeftCards,
    headerRightCards,
    footerCard,
    cardName,
  } = props

  function renderHeader(): React.ReactNode {
    let cls = `card-header tb-card-header tb-card-header-${cardName}`
    if (!withTitleSeparator) cls += " card-header-light"

    return (
      <div className={cls}>
        {title && <h3 className="card-title">{title}</h3>}
        <ul className="nav nav-pills card-header-pills">
          {headerLeftCards && headerLeftCards.map(renderLeftHeader)}
          {headerRightCards && headerRightCards.map(renderRightHeader)}
        </ul>
      </div>
    )
  }

  function renderLeftHeader(): React.ReactNode {
    return (
      <li className={`nav-item nav-item-${cardName}`}>
        <Card cardName={cardName} />
      </li>
    )
  }

  function renderRightHeader(
    cardName: PiCardRef,
    idx: number,
  ): React.ReactNode {
    const cls = `nav-item nav-item-${cardName} ${idx === 0 ? "ms-auto" : ""}`
    return (
      <li className={cls}>
        <Card cardName={cardName} />
      </li>
    )
  }

  function renderFooter(): React.ReactNode {
    if (!footerCard) return null

    return (
      <div className={`card-footer tb-card-footer tb-card-footer-${cardName}`}>
        <Card cardName={footerCard} />
      </div>
    )
  }

  return (
    <div className={`card tb-card tb-card-${cardName}`} data-pihanga={cardName}>
      {renderHeader()}
      <div className={`card-body tb-card-body tb-card-body-${cardName}`}>
        <Card cardName={contentCard} />
      </div>
      {renderFooter()}
    </div>
  )
}
