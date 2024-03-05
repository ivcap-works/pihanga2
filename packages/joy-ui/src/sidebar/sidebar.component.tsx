import * as React from "react"
import GlobalStyles from "@mui/joy/GlobalStyles"
import Avatar from "@mui/joy/Avatar"
import Box from "@mui/joy/Box"
import Button from "@mui/joy/Button"
import Card from "@mui/joy/Card"
import Divider from "@mui/joy/Divider"
import IconButton from "@mui/joy/IconButton"
import Input from "@mui/joy/Input"
import LinearProgress from "@mui/joy/LinearProgress"
import { listItemButtonClasses } from "@mui/joy/ListItemButton"
import Typography from "@mui/joy/Typography"
import Sheet from "@mui/joy/Sheet"
import Stack from "@mui/joy/Stack"
import { Interpolation, SxProps } from "@mui/material"
import { Theme } from "@mui/joy"

import SearchRoundedIcon from "@mui/icons-material/SearchRounded"
import CloseRoundedIcon from "@mui/icons-material/CloseRounded"
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded"

// import { Component as ColorSchemeToggle } from "../colorSchemeToggle/colorSchemeToggle.component"
// import { closeSidebar } from "../../../utils"
import { ComponentEvents, SidebarProps } from "./sidebar.types"
import { PiCardProps, Card as PiCard } from "@pihanga2/core"
import { getIcon } from "@pihanga2/cards/src/icons"
import { JyColorSchemeToggle } from "../colorSchemeToggle"

export type ComponentProps = SidebarProps & {
  joy?: {
    sx?: {
      root?: SxProps
    }
    globalStyles?: Interpolation<Theme>
  }
}

export const DEF_SX = {
  root: {
    position: { xs: "fixed", md: "sticky" },
    transform: {
      xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))",
      md: "none",
    },
    transition: "transform 0.4s, width 0.4s",
    zIndex: "calc(var(--joy-zIndex-modal) - 1)",
    height: "100dvh",
    width: "var(--Sidebar-width)",
    top: 0,
    p: 2,
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
    gap: 2,
    borderRight: "1px solid",
    borderColor: "divider",
  },
}

export const DEF_GLOBAL_STYLES: Interpolation<Theme> = (theme: Theme) => ({
  ":root": {
    "--Sidebar-width": "220px",
    [theme.breakpoints.up("lg")]: {
      "--Sidebar-width": "240px",
    },
  },
})

function openSidebar() {
  if (typeof document !== "undefined") {
    document.body.style.overflow = "hidden"
    document.documentElement.style.setProperty("--SideNavigation-slideIn", "1")
  }
}

function closeSidebar() {
  if (typeof document !== "undefined") {
    document.documentElement.style.removeProperty("--SideNavigation-slideIn")
    document.body.style.removeProperty("overflow")
  }
}

export const Component = (
  props: PiCardProps<ComponentProps, ComponentEvents>,
): React.ReactNode => {
  const {
    title,
    isOpen,
    user,
    menuCard,
    secondaryMenuCard,
    logoIcon,
    withSearch,
    onOpenSidebar,
    onCloseSidebar,
    onUserLogout,
    joy,
    cardName,
  } = props
  const [open, setOpen] = React.useState<boolean>(false)

  if (isOpen && !open) {
    openSidebar()
    setOpen(true)
    // maybe called twice - still not sure why
    setTimeout(() => onOpenSidebar({}))
  }
  if (!isOpen && open) {
    setOpen(false)
    closeSidebar()
  }

  function onOverlayClicked() {
    closeSidebar()
    //setOpen(false)
    onCloseSidebar({})
  }

  function renderLogo() {
    return (
      logoIcon !== undefined && (
        <IconButton variant="soft" color="primary" size="sm">
          {getIcon(logoIcon)}
        </IconButton>
      )
    )
  }

  function renderTitle() {
    return (
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        {renderLogo()}
        <Typography level="title-lg">{title}</Typography>
        <PiCard
          cardName={JyColorSchemeToggle({
            joy: { sx: { root: { ml: "auto" } } },
          })}
          parentCard={cardName}
        />
        {/* <ColorSchemeToggle sx={{ ml: "auto" }} /> */}
      </Box>
    )
  }

  function renderOverlay() {
    return (
      <Box
        className="Sidebar-overlay"
        sx={{
          position: "fixed",
          zIndex: 9998,
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          opacity: "var(--SideNavigation-slideIn)",
          backgroundColor: "var(--joy-palette-background-backdrop)",
          transition: "opacity 0.4s",
          transform: {
            xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))",
            lg: "translateX(-100%)",
          },
        }}
        onClick={onOverlayClicked}
      />
    )
  }

  function renderSearch() {
    return (
      <Input
        size="sm"
        startDecorator={<SearchRoundedIcon />}
        placeholder="Search"
      />
    )
  }

  function renderMainMenu() {
    return (
      <Box
        sx={{
          minHeight: 0,
          overflow: "hidden auto",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          [`& .${listItemButtonClasses.root}`]: {
            gap: 1.5,
          },
        }}
      >
        {menuCard && <PiCard cardName={menuCard} parentCard={cardName} />}
      </Box>
    )
  }

  function renderSecondaryMenu() {
    return (
      <Box
        sx={{
          mt: "auto",
          flexGrow: 0,
          "--ListItem-radius": (theme) => theme.vars.radius.sm,
          "--List-gap": "8px",
          mb: 2,
        }}
      >
        {secondaryMenuCard && (
          <PiCard cardName={secondaryMenuCard} parentCard={cardName} />
        )}
      </Box>
    )
  }

  function renderNotice() {
    return (
      <Card
        invertedColors
        variant="soft"
        color="warning"
        size="sm"
        sx={{ boxShadow: "none" }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography level="title-sm">Used space</Typography>
          <IconButton size="sm">
            <CloseRoundedIcon />
          </IconButton>
        </Stack>
        <Typography level="body-xs">
          Your team has used 80% of your available space. Need more?
        </Typography>
        <LinearProgress
          variant="outlined"
          value={80}
          determinate
          sx={{ my: 1 }}
        />
        <Button size="sm" variant="solid">
          Upgrade plan
        </Button>
      </Card>
    )
  }

  function renderUser() {
    if (!user) return null

    return (
      <>
        <Divider />
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          {renderUserAvatar()}
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography level="title-sm" noWrap>
              {user.name}
            </Typography>
            {user.email && (
              <Typography level="body-xs" noWrap>
                {user.email}
              </Typography>
            )}
          </Box>
          <IconButton
            size="sm"
            variant="plain"
            color="neutral"
            onClick={() => onUserLogout({})}
          >
            <LogoutRoundedIcon />
          </IconButton>
        </Box>
      </>
    )
  }

  function renderUserAvatar() {
    if (user?.avatarSrc) {
      return <Avatar variant="outlined" size="sm" src={user?.avatarSrc} />
    } else {
      return (
        <Avatar variant="outlined" size="sm">
          {user?.name.slice(0, 1)}
        </Avatar>
      )
    }
  }
  return (
    <Sheet
      className="Sidebar"
      sx={joy?.sx?.root || DEF_SX.root}
      data-pihanga={cardName}
    >
      <GlobalStyles styles={joy?.globalStyles || DEF_GLOBAL_STYLES} />
      {renderOverlay()}
      {renderTitle()}
      {withSearch && renderSearch()}
      <Box
        sx={{
          minHeight: 0,
          overflow: "hidden auto",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          [`& .${listItemButtonClasses.root}`]: {
            gap: 1.5,
          },
        }}
      >
        {renderMainMenu()}
        {renderSecondaryMenu()}
        {/* {renderNotice()} */}
      </Box>

      {renderUser()}
    </Sheet>
  )
}
