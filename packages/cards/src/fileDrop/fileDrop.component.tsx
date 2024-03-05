import React from "react"
import { PiCardProps } from "@pihanga2/core"
import { FileUploader } from "react-drag-drop-files"
import {
  DEF_FILE_DROP_FILE_TYPES,
  FileDropEvents,
  FileDropProps,
} from "./fileDrop"
import "./fileDrop.css"

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
    onFileDropped,
    cardName,
    _cls,
  } = props

  function handleChange(file: File): void {
    console.log(">>>> FILE", file)
    onFileDropped({ file })
  }

  function handleTypeError(err: any): void {
    console.log(">>>> TYPE ERROR", err)
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
      <div className="dropzone-msg">
        {title && <h3 className="dropzone-msg-title">{title}</h3>}
        {description && (
          <span className="dropzone-msg-desc">{description}</span>
        )}
      </div>
    )

    // return (
    //   <label className="fooX sc-beqWaB ewqTBN" htmlFor="file">
    //     <input accept=".jpg,.png,.gif" type="file" name="file" />
    //     <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.33317 6.66667H22.6665V16H25.3332V6.66667C25.3332 5.196 24.1372 4 22.6665 4H5.33317C3.8625 4 2.6665 5.196 2.6665 6.66667V22.6667C2.6665 24.1373 3.8625 25.3333 5.33317 25.3333H15.9998V22.6667H5.33317V6.66667Z" fill="#0658C2"></path><path d="M10.6665 14.6667L6.6665 20H21.3332L15.9998 12L11.9998 17.3333L10.6665 14.6667Z" fill="#0658C2"></path><path d="M25.3332 18.6667H22.6665V22.6667H18.6665V25.3333H22.6665V29.3333H25.3332V25.3333H29.3332V22.6667H25.3332V18.6667Z" fill="#0658C2"></path></svg>
    //     <div className="sc-dmqHEX kyUZVo">
    //       <span className="sc-hLseeU llmFop"><span>UploadX</span> or drop a file right here</span>
    //       <span title="allowed types: JPG,PNG,GIF" className="file-types">JPG,PNG,GIF</span>
    //     </div>
    //   </label>
    // )
  }

  return (
    <div
      className={`pi-file-drop pi-file-drop-${cardName}`}
      data-pihanga={cardName}
    >
      {showProgress ? renderProgress() : renderFileUploader()}
    </div>
  )
}
