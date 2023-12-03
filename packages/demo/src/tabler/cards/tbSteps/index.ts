import {
  PiRegister,
  actionTypesToEvents,
  createOnAction,
  registerActions,
  createCardDeclaration,
} from "@pihanga/core";
import { Component } from "./tbSteps.component";
import type { ComponentProps, StepEvent } from "./tbSteps.component";

const TB_STEPS = "TbSteps";

const ACTION_TYPES = registerActions("TB_STEPS", [
  "NEXT_STEP",
  "PREVIOUS_STEP",
  "CONFIRM",
  "CANCEL",
]);

export const onConfirm = createOnAction<StepEvent>(ACTION_TYPES.CONFIRM);

export const onNextStep = createOnAction<StepEvent>(ACTION_TYPES.NEXT_STEP);

export const onPreviousStep = createOnAction<StepEvent>(
  ACTION_TYPES.PREVIOUS_STEP
);

export const onCancel = createOnAction<StepEvent>(ACTION_TYPES.CANCEL);

export const TbSteps = createCardDeclaration<ComponentProps>(TB_STEPS);

export function init(register: PiRegister): void {
  register.cardComponent({
    name: TB_STEPS,
    component: Component,
    events: actionTypesToEvents(ACTION_TYPES),
  });
}
