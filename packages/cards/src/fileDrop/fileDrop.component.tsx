import React from "react"
import { PiCardProps } from "@pihanga2/core"
import { FileUploader } from "react-drag-drop-files"
import {
  DEF_FILE_DROP_FILE_TYPES,
  FileDropEvents,
  FileDropProps,
} from "./fileDrop.types"
import "./fileDrop.css"

let last_dropped: { name: string; file: File } | undefined

export function get_last_dropped(name: string): File | null {
  if (last_dropped?.name === name) {
    const file = last_dropped.file
    return file
  }
  return null
}

export const FileDropComponent = (
  props: PiCardProps<FileDropProps, FileDropEvents>,
): React.ReactNode => {
  const {
    fileTypes = DEF_FILE_DROP_FILE_TYPES,
    title = "Click or drop a file right here",
    description,
    showProgress = false,
    progress = 0,
    progressStyle = {},
    dropStyle = {},
    onFileDropped,
    onError,
    cardName,
    className,
    _cls,
  } = props

  function handleChange(file: File): void {
    console.log(">>>> FILE", file)
    const { name, size, type } = file
    last_dropped = { name, file }
    onFileDropped({ name, size, type })
    // clean up reference to File in a few sec to avoid dangling reference
    setTimeout(() => (last_dropped = undefined), 2000)
  }

  function handleTypeError(err: any): void {
    onError({ error: String(err) })
  }

  function renderProgress(): React.ReactNode {
    const label = `${progress}%`
    const msg = `${label} Complete`
    const containerStyle = { width: "50%", ...progressStyle }
    return (
      <div className="pi-progress">
        <div className="pi-progress-label">{label}</div>
        <div className="pi-progress-container" style={containerStyle}>
          <div
            className="pi-progress-bar"
            style={{ width: label }}
            role="progressbar"
            aria-label={msg}
          />
        </div>
      </div>
    )
  }

  function renderFileUploader(): React.ReactNode {
    return (
      <FileUploader
        handleChange={handleChange}
        onTypeError={handleTypeError}
        name="file"
        types={fileTypes}
        hoverTitle=" "
        children={renderDropZone()}
      />
    )
  }

  function renderDropZone(): React.ReactNode {
    //return null;
    return (
      <div className="dropzone-msg" style={dropStyle}>
        {title && <h3 className="dropzone-msg-title">{title}</h3>}
        {description && (
          <span className="dropzone-msg-desc">{description}</span>
        )}
      </div>
    )
  }

  // const cn = `pi-file-drop pi-file-drop-${cardName}`
  const cn = _cls("root", className)
  return (
    <div className={cn} data-pihanga={cardName}>
      {showProgress ? renderProgress() : renderFileUploader()}
    </div>
  )
}
