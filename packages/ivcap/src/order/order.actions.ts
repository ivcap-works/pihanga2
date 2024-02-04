import { registerActions } from "@pihanga/core"

export const ORDER_ACTION = registerActions("ivcap/order", [
  "load_list",
  "list",
  "load_record",
  "record",
  "create",
  "created",
])
