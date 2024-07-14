import {
  PiCardRef,
  createCardDeclaration,
  createOnAction,
  registerActions,
} from "@pihanga2/core"

export const FORM_CARD = "form"
export const Form = createCardDeclaration<FormProps, FormEvents>(FORM_CARD)

export const FORM_ACTION = registerActions(FORM_CARD, ["submit"])

export const onFormSubmit = createOnAction<FormSubmitEvent>(FORM_ACTION.SUBMIT)

export type FormProps = {
  content: PiCardRef[]
}

export type FormSubmitEvent = {
  formData: any
}

export type FormEvents = {
  onSubmit: FormSubmitEvent
}
