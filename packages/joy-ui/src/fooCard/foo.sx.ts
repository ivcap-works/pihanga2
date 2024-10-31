import { SxProps } from "@mui/joy/styles/types"

export type FooSX = {
  root?: SxProps
}

export const DEF_SX: FooSX = {
  root: {
    // "--Collapsed-breakpoint": "769px", // form will stretch when viewport is below `769px`
    // "--Cover-width": "50vw", // must be `vw` only

    // [`& .${formLabelClasses.asterisk}`]: {
    //   visibility: "hidden",
    // },

    // [theme.getColorSchemeSelector("light")]: {
    //   color: { xs: "#FFF", md: "text.tertiary" },
    //   "--Divider-lineColor": {
    //     xs: "#FFF",
    //     md: "var(--joy-palette-divider)",
    //   },
    // },
  },
}
