import React from "react"
import { Card, PiCardProps } from "@pihanga2/core"
import { ComponentEvents, LoginProps } from "./login.types"
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Link,
  Stack,
  Typography,
} from "@mui/joy"

import { LoginSX, DEF_SX } from "./login.sx"
import { getIcon } from "@pihanga2/cards/src"

export type ComponentProps = LoginProps & {
  sx?: LoginSX
}

interface FormElements extends HTMLFormControlsCollection {
  email: HTMLInputElement
  password: HTMLInputElement
  persistent: HTMLInputElement
}

interface SignInFormElement extends HTMLFormElement {
  readonly elements: FormElements
}

export const LoginComponent = (
  props: PiCardProps<ComponentProps, ComponentEvents>,
): React.ReactNode => {
  const {
    headerTitle,
    headerIcon,
    footerText,
    withLoginForm,
    signInHelp,
    loginProviders = [],
    showBackground,
    backgroundURL,
    sx,
    onWithProvider,
    cardName,
  } = props

  function renderBackground() {
    if (!showBackground) return null

    const bsx = sx?.background || DEF_SX.background
    let style: any = {}
    if (backgroundURL) {
      style.backgroundImage = `url(${backgroundURL})`
    }
    return <Box sx={bsx} style={style} />
  }

  function renderHeader() {
    return (
      <Box component="header" sx={sx?.header || DEF_SX.header}>
        <Box sx={{ gap: 2, display: "flex", alignItems: "center" }}>
          {headerIcon && (
            <IconButton variant="soft" color="primary" size="sm">
              {getIcon(headerIcon)}
            </IconButton>
          )}
          <Typography level="title-lg">{headerTitle}</Typography>
        </Box>
        {/* <ColorSchemeToggle /> */}
      </Box>
    )
  }

  function renderDivider() {
    return <Divider sx={sx?.divider || DEF_SX.divider}>or</Divider>
  }

  function renderLoginForm() {
    if (!withLoginForm) return null

    return (
      <>
        {loginProviders.length > 0 && renderDivider()}
        <Stack gap={4} sx={{ mt: 2 }}>
          <form
            onSubmit={(event: React.FormEvent<SignInFormElement>) => {
              event.preventDefault()
              const formElements = event.currentTarget.elements
              const data = {
                email: formElements.email.value,
                password: formElements.password.value,
                persistent: formElements.persistent.checked,
              }
              alert(JSON.stringify(data, null, 2))
            }}
          >
            <FormControl required>
              <FormLabel>Email</FormLabel>
              <Input type="email" name="email" />
            </FormControl>
            <FormControl required>
              <FormLabel>Password</FormLabel>
              <Input type="password" name="password" />
            </FormControl>
            <Stack gap={4} sx={{ mt: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Checkbox size="sm" label="Remember me" name="persistent" />
                <Link level="title-sm" href="#replace-with-a-link">
                  Forgot your password?
                </Link>
              </Box>
              <Button type="submit" fullWidth>
                Sign in
              </Button>
            </Stack>
          </form>
        </Stack>
      </>
    )
  }

  function renderSignInHelper() {
    if (!signInHelp) return null

    return <Card cardName={signInHelp} parentCard={cardName} />
    // return (
    //   <Typography level="body-sm">
    //     New to company?{" "}
    //     <Link href="#replace-with-a-link" level="title-sm">
    //       Sign up!
    //     </Link>
    //   </Typography>
    // )
  }

  function renderLoginProviders() {
    if (loginProviders.length === 0) return null

    return (
      <Stack gap={2}>
        {loginProviders.map((p, idx) => (
          <Button
            variant="soft"
            color="neutral"
            fullWidth
            startDecorator={p.logo && getIcon(p.logo)}
            onClick={() => onWithProvider({ providerID: p.id })}
            key={idx}
          >
            {p.title}
          </Button>
        ))}
      </Stack>
    )
  }
  //<GoogleIcon />

  function renderFooter() {
    if (!footerText) return null
    return (
      <Box component="footer" sx={{ py: 3 }}>
        <Typography level="body-xs" textAlign="center">
          {footerText}
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={sx?.root || DEF_SX.root} data-pihanga={cardName}>
      <Box sx={showBackground ? sx?.main || DEF_SX.main : {}}>
        <Box sx={sx?.body || DEF_SX.body}>
          {renderHeader()}
          <Box component="main" sx={sx?.content || DEF_SX.content}>
            <Stack gap={4} sx={{ mb: 2 }}>
              <Stack gap={1}>
                <Typography component="h1" level="h3">
                  Sign in
                </Typography>
                {renderSignInHelper()}{" "}
              </Stack>
            </Stack>

            {renderLoginProviders()}

            {renderLoginForm()}
          </Box>
          {renderFooter()}
        </Box>
      </Box>
      {renderBackground()}
    </Box>
  )
}
