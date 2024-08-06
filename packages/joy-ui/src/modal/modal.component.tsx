import React from "react"
import { Card, PiCardProps } from "@pihanga2/core"
import {
  ModalEvents,
  MODAL_MAX_WIDTH_DEF,
  MODAL_MIN_WIDTH_DEF,
  ModalProps,
} from "@pihanga2/cards"
import { SxProps } from "@mui/joy/styles/types"
import { Modal, Sheet, ModalClose, Typography } from "@mui/joy"

type ComponentProps = ModalProps & {
  joy?: {
    sx?: {
      root?: SxProps
      sheet?: SxProps
    }
  }
}

const DEF_SX = {
  root: { display: "flex", justifyContent: "center", alignItems: "center" },
  sheet: {
    // maxWidth: 500,
    // minWidth: 300,
    borderRadius: "md",
    p: 3,
    boxShadow: "lg",
    zIndex: 200000, // make sure we are above any sidebars
  },
}

export const ModalComponent = (
  props: PiCardProps<ComponentProps, ModalEvents>,
): React.ReactNode => {
  const [isOpen, setOpen] = React.useState<boolean>(false)
  const {
    title,
    open,
    contentCard,
    footerCard,
    maxWidth,
    minWidth,
    onOpen,
    onClose,
    cardName,
    joy,
    _cls,
  } = props
  const sx = joy?.sx || DEF_SX

  if (open && !isOpen) {
    setOpen(true)
    onOpen({})
  }

  function onCloseHandler() {
    setOpen(false)
    onClose({})
  }
  const sheetStyle = {
    maxWidth:
      maxWidth || ((sx.sheet || {}) as any).maxWidth || MODAL_MAX_WIDTH_DEF,
    minWidth:
      minWidth || ((sx.sheet || {}) as any).minWidth || MODAL_MIN_WIDTH_DEF,
  }
  // <Stack
  //   direction="column"
  //   justifyContent="space-between"
  //   alignItems="flex-start"
  //   spacing={0}
  // ></Stack>
  return (
    <Modal
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
      open={open}
      onClose={onCloseHandler}
      sx={sx.root}
      className={_cls("root")}
      data-pihanga={cardName}
    >
      <Sheet
        variant="outlined"
        sx={sx.sheet}
        style={sheetStyle}
        className={_cls("sheet")}
      >
        <ModalClose variant="plain" sx={{ m: 1 }} />
        <Typography
          component="h2"
          level="h4"
          textColor="inherit"
          fontWeight="lg"
          mb={1}
          className={_cls("title")}
        >
          {title}
        </Typography>
        <Card cardName={contentCard} parentCard={cardName} />
        {footerCard && <Card cardName={footerCard} parentCard={cardName} />}
      </Sheet>
    </Modal>
  )
}

// function renderTitle() {
//   if (!title) return null

//   return (
//     <div className="modal-header">
//       <h5 className="modal-title">{title}</h5>
//       <button
//         type="button"
//         className="btn-close"
//         data-bs-dismiss="modal"
//         aria-label="Close"
//         onClick={() => closeModal(_dispatch)}
//       ></button>
//     </div>
//   )
// }

// function renderDownloadButton() {
//   if (!downloadBlob) return null

//   const fname = downloadName || "file"
//   return (
//     <a
//       type="button"
//       href={downloadBlob}
//       download={fname}
//       className="btn btn-primary"
//     >
//       Download
//     </a>
//   )
// }

// const op = {
//   className: `modal modal-blur fade show pi-tb-model-card pi-tb-model-card-${cardName}`,
//   "aria-modal": true,
//   style: { display: "block" },
//   tabIndex: -1,
// }
// return (
//   <div {...op} data-pihanga={cardName}>
//     <div
//       className="modal-dialog modal-lg modal-dialog-centered"
//       role="document"
//     >
//       <div className="modal-content">
//         {renderTitle()}
//         <div className="modal-body">
//           <Card cardName={bodyCard} />
//         </div>
//         <div className="modal-footer">
//           <button
//             type="button"
//             className="btn me-auto"
//             data-bs-dismiss="modal"
//             onClick={() => closeModal(_dispatch)}
//           >
//             Close
//           </button>
//           {renderDownloadButton()}
//         </div>
//       </div>
//     </div>
//   </div>
// )
// }
