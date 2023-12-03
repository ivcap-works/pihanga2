import { PiCardDef, PiMapProps, PiRegister } from "@pihanga/core";
import { Component } from "./tbEmptyList.component";
import type { ComponentProps } from "./tbEmptyList.component";

export const TB_EMPTY_LIST = "TbEmptyList";

type CardProps<S> = PiMapProps<ComponentProps, S>;
export function TbEmptyList<S>(p: CardProps<S>): PiCardDef {
  return {
    ...p,
    cardType: TB_EMPTY_LIST,
  };
}

export function init(register: PiRegister): void {
  register.cardComponent({
    name: TB_EMPTY_LIST,
    component: Component,
  });
}
