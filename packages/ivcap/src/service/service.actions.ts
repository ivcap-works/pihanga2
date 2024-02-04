import { registerActions } from "@pihanga/core"

export const SERVICE_ACTION = registerActions("ivcap/service", [
  "load_list",
  "list",
  "load_record",
  "record",
])
