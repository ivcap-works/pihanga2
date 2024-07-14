import React from "react"
import { Card, PiCardProps } from "@pihanga2/core"
import { FormEvents, FormProps } from "./form.types"

export const FormComponent = (
  props: PiCardProps<FormProps, FormEvents>,
): React.ReactNode => {
  const { content, onSubmit, cardName, _cls } = props

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const fd = new FormData(event.currentTarget)
    const formData = Object.fromEntries(fd)
    onSubmit({ formData })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={_cls("root")}
      data-pihanga={cardName}
    >
      {content.map((c, i) => (
        <Card cardName={c} parentCard={cardName} key={i} />
      ))}
      {props.children}
    </form>
  )
}
