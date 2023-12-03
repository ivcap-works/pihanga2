import React from "react"
import { Card, PiCardProps } from "@pihanga/core"
import styles from "./tbXLCard.module.css"

export type ComponentProps = {
  title: string
  contentCard: string
  // children: JSX.Element | JSX.Element[];
  actionCards?: string[]
  infoCards?: string[]
  wrapContentInCard?: boolean
}

export const Component = (
  props: PiCardProps<ComponentProps>,
): React.ReactNode => {
  const {
    title,
    contentCard,
    wrapContentInCard = true,
    actionCards,
    infoCards,
    cardName,
  } = props
  const cls = (...n: string[]) => props._cls(n[0], styles)

  function renderTitle(): React.ReactNode {
    return (
      <div className="col-auto">
        <div className="page-title">{title}</div>
      </div>
    )
  }

  function renderActions(): React.ReactNode {
    if (!actionCards) return null
    return <div className="col">{actionCards.map(renderCard)}</div>
  }

  function renderInfo(): React.ReactNode {
    if (!infoCards) return null
    return <div className="col-auto">{infoCards.map(renderCard)}</div>
  }

  function renderCard(name: string, idx: number): React.ReactNode {
    return <Card cardName={name} key={idx} />
  }

  function renderContentCard(): React.ReactNode {
    if (wrapContentInCard) {
      return (
        <div className="card">
          <Card cardName={contentCard} />
        </div>
      )
    } else {
      return <Card cardName={contentCard} />
    }
  }

  return (
    <div className={cls("root")} data-pihanga={cardName}>
      <div
        className="page-header d-print-none"
        data-pihanga-comp="tablerXLCard:title"
      >
        <div className="container-xl">
          <div className="row g-2 align-items-center">
            {renderTitle()}
            {renderActions()}
            {renderInfo()}
          </div>
        </div>
      </div>
      {/* Page body */}
      <div className="page-body" data-pihanga-comp="tablerXLCard:body">
        <div className="container-xl">{renderContentCard()}</div>
      </div>
    </div>
  )
}
