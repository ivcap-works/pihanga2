import { formLabelClasses } from "@mui/joy"
import { SxProps } from "@mui/joy/styles/types"

export type LoginSX = {
  root?: SxProps
  main?: SxProps
  body?: SxProps
  header?: SxProps
  content?: SxProps
  divider?: SxProps
  background?: SxProps
}

export const DEF_SX: LoginSX = {
  root: {
    "--Collapsed-breakpoint": "769px", // form will stretch when viewport is below `769px`
    "--Cover-width": "50vw", // must be `vw` only
    "--Form-maxWidth": "800px",
    "--Transition-duration": "0.4s", // set to `none` to disable transition
  },

  main: (theme) => ({
    width:
      "clamp(100vw - var(--Cover-width), (var(--Collapsed-breakpoint) - 100vw) * 999, 100vw)",
    transition: "width var(--Transition-duration)",
    transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
    position: "relative",
    zIndex: 1,
    display: "flex",
    justifyContent: "flex-end",
    backdropFilter: "blur(12px)",
    backgroundColor: "rgba(255 255 255 / 0.2)",
    [theme.getColorSchemeSelector("dark")]: {
      backgroundColor: "rgba(19 19 24 / 0.4)",
    },
  }),

  body: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100dvh",
    width:
      "clamp(var(--Form-maxWidth), (var(--Collapsed-breakpoint) - 100vw) * 999, 100%)",
    maxWidth: "100%",
    px: 2,
  },

  header: {
    py: 3,
    display: "flex",
    alignItems: "left",
    justifyContent: "space-between",
  },

  content: {
    my: "auto",
    py: 2,
    pb: 5,
    display: "flex",
    flexDirection: "column",
    gap: 2,
    width: 400,
    maxWidth: "100%",
    mx: "auto",
    borderRadius: "sm",
    "& form": {
      display: "flex",
      flexDirection: "column",
      gap: 2,
    },
    [`& .${formLabelClasses.asterisk}`]: {
      visibility: "hidden",
    },
  },

  divider: (theme) => ({
    [theme.getColorSchemeSelector("light")]: {
      color: { xs: "#FFF", md: "text.tertiary" },
      "--Divider-lineColor": {
        xs: "#FFF",
        md: "var(--joy-palette-divider)",
      },
    },
  }),

  background: (theme) => ({
    height: "100%",
    position: "fixed",
    right: 0,
    top: 0,
    bottom: 0,
    left: "clamp(0px, (100vw - var(--Collapsed-breakpoint)) * 999, 100vw - var(--Cover-width))",
    transition:
      "background-image var(--Transition-duration), left var(--Transition-duration) !important",
    transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
    backgroundColor: "background.level1",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundImage:
      "url(https://images.unsplash.com/photo-1527181152855-fc03fc7949c8?auto=format&w=1000&dpr=2)",
    [theme.getColorSchemeSelector("dark")]: {
      backgroundImage:
        "url(https://images.unsplash.com/photo-1572072393749-3ca9c8ea0831?auto=format&w=1000&dpr=2)",
    },
  }),
}
