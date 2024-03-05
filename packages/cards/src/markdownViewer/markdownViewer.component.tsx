import React, { useState } from "react"
import ReactMarkdown from "react-markdown"
import { PiCardProps } from "@pihanga2/core"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import "katex/dist/katex.min.css" // `rehype-katex` does not import the CSS for you
import { MarkdownViewerProps } from "./markdownViewer"

export const MarkdownViewerComponent = (
  props: PiCardProps<MarkdownViewerProps>,
): React.ReactNode => {
  const {
    source,
    path,
    maxBodyLength = -1,
    remarkPlugins = [remarkMath],
    rehypePlugins = [rehypeKatex],
    remarkRehypeOptions,
    extraClassName,
    extraStyle = {},
    cardName,
    _cls,
  } = props
  const [fetchedText, setFetchedText] = useState("")
  const text = source || fetchedText

  if (path && fetchedText === "") {
    fetch(path!)
      .then((response) => response.text())
      .then((text) => setFetchedText(text))
  }

  function decode(s: string): string {
    try {
      return decodeURI(s)
    } catch (e) {
      // may fail if actually not encoded and contains '%'
      return s
    }
  }

  function shortenBody(text: string): string {
    if (text.length <= maxBodyLength) return text

    const sb = text
      .split(" ")
      .reduce(
        (p, el) => {
          const [a, cnt] = p
          if (cnt < maxBodyLength) {
            return [a.concat(el), cnt + el.length + 1] as [string[], number]
          } else {
            return p
          }
        },
        [[], 0] as [string[], number],
      )[0]
      .join(" ")
    return sb.length < text.length ? `${sb}...` : text
  }

  const t = decode(text)
  const t2 = maxBodyLength > 0 ? shortenBody(t) : t

  return (
    <div
      className={_cls("root", extraClassName)}
      style={extraStyle}
      data-pihanga={cardName}
    >
      <ReactMarkdown
        children={t2}
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
        remarkRehypeOptions={remarkRehypeOptions}
      />
    </div>
  )
}
