import React, { useRef, useState } from "react"
import {
  GoogleMap,
  MarkerF,
  MarkerClusterer,
  useJsApiLoader,
} from "@react-google-maps/api"
import type {
  ClustererOptions,
  Clusterer,
} from "@react-google-maps/marker-clusterer"

// import styled from './facetMap.style';
// import { CardAction, Resources } from '../../../app.type';
import { PiCardProps } from "@pihanga/core"
import { GMapMarkerPropsT, GoogleMapProps, GoogleMapEvents } from "./googleMap"

const center = {
  lat: -25.8080134,
  lng: 134.6461083,
}

export const GoogleMapComponent = (
  props: PiCardProps<GoogleMapProps, GoogleMapEvents>,
): React.ReactNode => {
  const {
    cardName,
    markers,
    apiKey,
    zoomLevel = 3,
    width = "auto",
    height = 400,
    onMarkerSelected,
    onMarkersInBounds,
  } = props
  const elRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map>()
  // const [infoBoxLoc, setInfoBoxLoc] = useState<google.maps.LatLng | undefined>();

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    // ...otherOptions
  })

  // console.log('MAP REF/loaded', map, isLoaded);
  const style = {}

  // function onCloseMap(): void {
  //   onMapClose({});
  // }

  function renderMap(): React.ReactNode {
    if (!isLoaded) return null

    const locs: GMapMarkerPropsT[] = markers.map((m, i) => {
      const _id = `${m.id}:${i}`
      const ghash = `${m.lat}:${m.lng}`
      const label = m.label || ""
      return { id: _id, ghash, label, lat: m.lat, lng: m.lng }
    })

    //     const locs: MarkerProps[] = []

    const containerStyle = { width, height }

    const options: google.maps.MapOptions = {
      fullscreenControl: false,
      mapTypeControl: false,
      streetViewControl: false,
      zoomControlOptions: {
        // position: google.maps.ControlPosition.RIGHT_CENTER // 'right-center' ,
        // ...otherOptions
      },
    }

    function onBoundsChanged(): void {
      if (map) {
        var b = map.getBounds()
        if (b === undefined) return // can't get bounds

        const markerIDs = locs
          .filter((l) => {
            const p = new google.maps.LatLng(l.lat, l.lng)
            return b && b.contains(p)
          })
          .map((r) => r.id)
        var sw = b.getSouthWest()
        var ne = b.getNorthEast()
        const bounds = {
          n: ne.lat(),
          e: ne.lng(),
          s: sw.lat(),
          w: sw.lng(),
        }
        onMarkersInBounds({ bounds, markerIDs })
        // console.log('BOUNDS CHANGED', markerIDs.length, sw, ne.toString());
      }
    }

    function onMarker(sel: GMapMarkerPropsT[]): void {
      const markerIDs = sel.map((s) => s.id)
      const resources = markerIDs.map((id) => {
        const [resourceID, locationID] = id.split(":").map((s) => Number(s))
        return { resourceID, locationID }
      })
      onMarkerSelected({ resources, markerIDs })
    }

    const clusterOpts: ClustererOptions = {
      gridSize: 30,
      //imagePath: 'img/markerclusterer/m',
    }

    // deal with potentially multiple markers being at the same location
    // TODO: Should make that fuzzy as we may not zoom in deep enough to separate closeby images
    const locb = locs.reduce((p, m) => {
      const a = p[m.ghash] || []
      p[m.ghash] = a.concat(m)
      return p
    }, {} as { [k: string]: GMapMarkerPropsT[] })

    function renderMarker(
      el: GMapMarkerPropsT[],
      clusterer: Clusterer,
    ): React.ReactElement {
      // console.log("renderMarker", el);
      const isSingle = el.length < 2
      const l = el[0]
      // const idx = isSingle ? 0 : 1;
      // const icon = DEF_MARKER[idx] // hlid.has(l.rid) ? SELECTED_MARKER[idx] : DEF_MARKER[idx];
      const lat: number = typeof l.lat === "string" ? parseFloat(l.lat) : l.lat
      const lng: number = typeof l.lng === "string" ? parseFloat(l.lng) : l.lng
      return (
        <MarkerF
          key={l.ghash}
          position={{ lat, lng }}
          title={isSingle ? l.label : "Co-located resources"}
          // icon={icon}
          onClick={(): void => onMarker(el)}
          clusterer={clusterer}
        />
      )
    }

    function renderMarkerClusterer(): React.ReactNode {
      const markers = Object.values(locb)
      return (
        <MarkerClusterer options={clusterOpts}>
          {(clusterer: Clusterer): any => (
            <>{markers.flatMap((el) => renderMarker(el, clusterer))}</>
          )}
        </MarkerClusterer>
      )
    }

    return (
      <GoogleMap
        options={options}
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoomLevel}
        onLoad={setMap}
        onBoundsChanged={onBoundsChanged}
      >
        {renderMarkerClusterer()}
        {/* {renderClose()} */}
      </GoogleMap>
    )
  }

  // function renderInfoBox() {
  //   if (!infoBoxLoc) return null;
  //   return (
  //     <InfoWindow position={infoBoxLoc}>
  //       <div style={{color: 'yellow'}}>
  //         <h1>InfoWindow</h1>
  //       </div>
  //     </InfoWindow>
  //   )
  // }

  // function renderClose(): React.ReactNode {
  //   return (
  //     <button
  //       draggable="false"
  //       title="Close map selector"
  //       aria-label="Close map selector"
  //       type="button"
  //       onClick={onCloseMap}
  //       className={`gmap-control-active`}
  //     >
  //       {[666, 333, 111].map((fill, idx) => (
  //         <img
  //           src={getCross(fill)}
  //           alt=""
  //           className={cls(idx > 0 && 'gmap-icon-hover', 'gmap-close-map')}
  //           key={idx}
  //         />
  //       ))
  //       }
  //     </button>
  //   );
  // }

  // function getCross(fill: number): string {
  //   return [
  //     'data:image/svg+xml,',
  //     '%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2218%22%20',
  //     'height%3D%2218%22%20viewBox%3D%220%200%2018%2018%22%3E%0A%20%20%20%20%3Cpolygon%20',
  //     'fill%3D%22%23',
  //     fill,
  //     '%22%20points%3D%2218%2C7%2011%2C7%2011%2C0%207%2C0%207%2C7%200%2C7%200%2C11%207%2C11',
  //     '%207%2C18%2011%2C18%2011%2C11%2018%2C11%22%20%20transform%3D%22rotate%28-45%209%209%29',
  //     '%22%2F%3E%0A%3C%2Fsvg%3E%0A',
  //   ].join('');
  // }

  function renderError(): React.ReactNode {
    return (
      <div className={"pi-gmap-error-msg"}>
        Map cannot be loaded right now, sorry.
      </div>
    )
  }

  return (
    <div
      className={`pi-gmap pi-gmap-${cardName}`}
      style={style}
      ref={elRef}
      data-pihange={cardName}
    >
      {loadError ? renderError() : renderMap()}
    </div>
  )
}
