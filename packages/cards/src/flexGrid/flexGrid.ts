import { createCardDeclaration } from "@pihanga/core"

export const FLEX_GRID_TYPE = "flex_grid"
export const FLEX_GRID = createCardDeclaration<FlexGridProps>(FLEX_GRID_TYPE)

export type FlexGridProps = {
  cards: string[]
  template: TemplateT
  height?: string
  margin?: string
  overflow?: string
}

// body {
//   display: grid;
//   grid-template-areas:
//     "header header header"
//     "nav article ads"
//     "footer footer footer";
//   grid-template-rows: 60px 1fr 60px;
//   grid-template-columns: 20% 1fr 15%;
//   grid-gap: 10px;
//   height: 100vh;
//   margin: 0;
//   }

export type TemplateT = {
  area: number[][] // index into cards[]
  rows: string[]
  columns: string[]
  gap?: string
}
