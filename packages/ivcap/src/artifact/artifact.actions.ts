import { registerActions } from "@pihanga/core"

export const ACTION_TYPES = registerActions("ivcap/artifact", [
  "load_list",
  "list",
  "load_record",
  "record",
  "load_data",
  "data",
  "upload_data",
  "uploaded_record",
  "upload_partial",
  "upload_progress",
])
