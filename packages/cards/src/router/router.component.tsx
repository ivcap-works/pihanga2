import React from "react"
import { PiCardProps } from "@pihanga2/core"
import { Card } from "@pihanga2/core"
import { RouterProps } from "./router.types"

export const RouterComponent = (
  props: PiCardProps<RouterProps>,
): React.ReactNode => {
  const { contentCard, cardName } = props
  return (
    <React.Fragment>
      <Card cardName={contentCard} parentCard={cardName} />
    </React.Fragment>
  )
}
