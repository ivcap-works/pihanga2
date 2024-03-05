import { registerActions } from "@pihanga2/core"

export const ASPECT_ACTION = registerActions("ivcap/aspect", [
  "list",
  "record",
  "create",
  "created",
  "load_list",
  "load_record",
])
