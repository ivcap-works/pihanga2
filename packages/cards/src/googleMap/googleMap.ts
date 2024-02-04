import { createCardDeclaration, registerActions } from "@pihanga/core"

export const GOOGLE_MAP_TYPE = "google-map"
export const GoogleMap = createCardDeclaration<GoogleMapProps>(GOOGLE_MAP_TYPE)

export const GOOGLE_MAP_ACTION = registerActions(GOOGLE_MAP_TYPE, [
  "marker-selected",
  "marker-in-bounds",
  "close",
])

export type GoogleMapProps = {
  markers: GMapMarkerT[]
  apiKey: string
  zoomLevel?: number
  width?: string | number
  height?: string | number
}

export type GMapMarkerT = {
  id: string
  label?: string
  lat: number
  lng: number
}

export type GMapResourcesT = {
  searchText?: string // text used to filter records
  searchValue?: string // currently shown in search box
  geoBounds?: GMapGeoBoundsT
  highlight?: GMapHighlightSelectionT
  records: GMapResourceRecordT[]
}

export type GMapResourceRecordT = {
  id: number
  name: string
  logo: string
  description: string
  url: string
  topics: string[]
  locations: GMapResourceLocationT[]
}

export type GMapResourceLocationT = {
  id: number
  address: string
  state: string
  lat: number
  lon: number
}

export type GMapGeoBoundsT = {
  n: number
  e: number
  s: number
  w: number
}

export type GMapHighlightSelectionT = {
  resources: {
    resourceID: number
    locationID: number
  }[]
  ts: number
}

export type GMapMarkerPropsT = {
  id: string
  label?: string
  lat: number
  lng: number
  ghash: string
}

export type GmapMarkerSelectedEvent = {
  resources: { resourceID: number; locationID: number }[]
  markerIDs: string[]
}

export type GMapMarkersInBoundsEvent = {
  bounds: { n: number; e: number; s: number; w: number }
  markerIDs: string[]
}

export type GMapCloseEvent = {}

export type GoogleMapEvents = {
  onMarkerSelected: GmapMarkerSelectedEvent
  onMarkersInBounds: GMapMarkersInBoundsEvent
  onClose: GMapCloseEvent
}
