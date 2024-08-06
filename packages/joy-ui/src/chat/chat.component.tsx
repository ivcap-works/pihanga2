import React, { useState } from "react"
import Stack from "@mui/joy/Stack"
import Box from "@mui/joy/Box"
import Avatar from "@mui/joy/Avatar"
import { Card, PiCardProps } from "@pihanga2/core"
import { ChatMessage, ChatProps } from "@pihanga2/cards"

const sx = {
  maxWidth: "calc(100%  198px)",
  backgroundColor: "var(--msgBackgroundColor)",

  paddingRight: "15px",
  paddingLeft: "15px",
  paddingBottom: "8px",
  paddingTop: "8px",

  borderLeftWidth: "var(--msgBorderWidth)",
  borderRightWidth: "var(--msgBorderWidth)",
  borderTopWidth: "var(--msgBorderWidth)",
  borderBottomWidth: "var(--msgBorderWidth)",

  borderTopLeftRadius: "var(--msgBorderRadiusLarge)",
  borderTopRightRadius: "var(--msgBorderRadiusLarge)",
  borderBottomLeftRadius: "var(--msgBorderRadiusLarge)",
  borderBottomRightRadius: "var(--msgBorderRadiusLarge)",
  borderBottomColor: "var(--msgBorderStroke)",
  borderLeftColor: "var(--msgBorderStroke)",
  borderRightColor: "var(--msgBorderStroke)",
  borderTopColor: "var(--msgBorderStroke)",
  borderStyle: "solid",

  FontFamily: "var(--fontFamilyBase)",
}

const senderSx = {
  marginBottom: "2px",
  alignItems: "baseline",
  color: "var(--colorMeta)",
  columnGap: "8px",
  lineHeight: "var(--lineHeightMeta)",
  fontSize: "var(--fontSizeMeta)",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  overflow: "hidden",
}

const cssVars = {
  "--msgBackgroundColor": "rgb(245, 245, 245)",
  "--msgBorderRadiusLarge": "6px",
  "--msgBorderWidth": "1px",
  "--msgBorderStroke": "transparent",
  "--colorMeta": "rgb(97, 97, 97)",
  "--lineHeightMeta": "16px",
  "--fontSizeMeta": "12px",
  "--fontFamilyBase":
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, 'Apple Color Emoji', 'Segoe UI Emoji', sans-serif",
} as React.CSSProperties

export const ChatComponent = (
  props: PiCardProps<ChatProps>,
): React.ReactNode => {
  const inputRef = React.useRef<HTMLDivElement | null>(null)
  const [currentMessages, setMessages] = useState<ChatMessage[]>([])

  const { cardName, messages, style, _cls } = props

  if (messages !== currentMessages) {
    setMessages(messages)
    const el = inputRef.current
    if (el) {
      setTimeout(() => el.scrollTo(0, el.scrollHeight), 10)
    }
  }

  const outerSx = {
    display: "flex",
    overflow: "scroll",
    flexDirection: "column-reverse",
    ...style?.joy?.outer,
  }

  const innerSX = {
    width: "100%",
    paddingLeft: "20px",
    paddingRight: "20px",
    ...style?.joy?.inner,
  }

  const msgSx = {
    display: "grid",
    columnGap: "6px",
    // flexDirection: "column",
    paddingTop: "12px",
  }

  function renderMessage(m: ChatMessage, idx: any) {
    const gridTemplateAreas = ['". sender"', '"avatar msg"'].join(" ")
    const msgStyle = {
      float: m.side,
      gridTemplateAreas,
      // alignItems: m.side === "left" ? "flex-start" : "flex-end",
    }
    return (
      <div key={idx}>
        <Box component="div" sx={msgSx} style={msgStyle}>
          {renderSender(m)}
          {renderAvatar(m)}
          <div style={{ gridArea: "msg" }}>
            <Box sx={sx} style={{ float: m.side }} component="div">
              <Card cardName={m.content} parentCard={cardName} />
            </Box>
          </div>
        </Box>
      </div>
    )
  }

  function renderSender(m: ChatMessage) {
    if (m.sender === undefined && m.date === undefined) return null

    const dateS = formatDate(m.date) || ""

    return (
      <div style={{ gridArea: "sender" }}>
        <Box sx={senderSx} style={{ float: m.side }} component="div">
          {m.sender}&nbsp;&nbsp;&nbsp;{dateS}
        </Box>
      </div>
    )
  }

  const shortFormatter = new Intl.DateTimeFormat(navigator.language, {
    timeStyle: "short",
  })
  const longFormatter = new Intl.DateTimeFormat(navigator.language, {
    timeStyle: "short",
    dateStyle: "short",
  })

  function formatDate(date: Date | undefined) {
    if (!date) return null

    let d = date
    if (typeof d === "number") {
      d = new Date(d)
    }
    if (!(d instanceof Date)) {
      console.log("chat: unexpected date", d)
      return null
    }

    const diffHours = Math.floor(
      Math.abs(Date.now() - d.getTime()) / 1000 / 60 / 60,
    )
    let t: string
    if (diffHours > 8) {
      t = longFormatter.format(d)
    } else {
      t = shortFormatter.format(d)
    }
    return t
  }

  function renderAvatar(m: ChatMessage) {
    if (m.avatar) {
      return <Card cardName={m.avatar} parentCard={cardName} />
    }
    if (m.sender) {
      return (
        <Avatar
          alt={m.sender}
          color="primary"
          style={{ gridArea: "avatar" }}
        ></Avatar>
      )
    }
    return null
  }

  return (
    <Box
      sx={outerSx}
      style={style}
      component="div"
      className={_cls("root")}
      ref={inputRef}
      data-pihanga={cardName}
    >
      <Stack sx={innerSX}>
        {/* push down when only a few bubbles are there */}
        <div style={{ flex: 1 }} />
        <Stack style={cssVars}>{messages.map(renderMessage)}</Stack>
      </Stack>
    </Box>
  )
}
