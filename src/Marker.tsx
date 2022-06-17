import { FC, memo, useCallback, useEffect, useState } from "react";
import type { MarkerProps } from "./types";
import * as Leaflet from 'leaflet'
import { latLngToLeafletLatLng } from "./util";

const Marker: FC<MarkerProps> = ({map, identifier, title, description, image, icon, opacity, coordinate, anchor, onPress}) => {
  
  const [marker, setMarker] = useState<Leaflet.Marker>()

  const getMarkerIconSize = useCallback((): Leaflet.Point | undefined => {
    if (icon && typeof icon !== 'string' && (icon.width || icon.height)) {
      return new Leaflet.Point(icon.width ?? 0, icon.height ?? 0)
    }

    if (image && typeof image !== 'string' && (image.width || image.height)) {
      return new Leaflet.Point(image.width ?? 0, image.height ?? 0)
    }

    return undefined
  }, [icon, image])

  const getMarkerIconUrl = useCallback((): string => {
    if (icon) {
      return typeof icon === 'string' ? icon : icon.uri ?? ''
    }

    if (image) {
      return typeof image === 'string' ? image : image.uri ?? ''
    }

    return ''
  }, [icon, image])

  const getMarkerIcon = useCallback((): Leaflet.Icon | undefined => {
    if (!image && !icon) {
      return undefined
    }

    const iconUrl = getMarkerIconUrl()

    return Leaflet.icon({
      iconUrl,
      iconRetinaUrl: iconUrl,
      iconSize: getMarkerIconSize(),
      iconAnchor: anchor ? new Leaflet.Point(anchor.x, anchor.y) : undefined,
    })
  }, [image, icon, getMarkerIconUrl, anchor, getMarkerIconSize])

  const getMarkerTitle = useCallback((): string => {
    if (!title && !description) {
      return ''
    }

    if (title && !description) {
      return title
    } else if (description && !title) {
      return description
    }

    return `${title} - ${description}`
  }, [title, description])

  useEffect(() => {
    if (!marker && map && coordinate) {
      const options: Leaflet.MarkerOptions = {
        title: getMarkerTitle(),
        opacity,
      }

      const customIcon = getMarkerIcon()

      if (customIcon) {
        options.icon = customIcon
      }

      const newMarker = new Leaflet.Marker(latLngToLeafletLatLng(coordinate), options).addTo(map)

      setMarker(newMarker)
    } else if (marker) {
      const handleOnClick = (event: Leaflet.LeafletEvent) => {
        if (onPress) {
          onPress({
            ...event,
            action: 'marker-press',
            coordinate,
            id: identifier
          })
        }
      }

      marker.addEventListener('click', handleOnClick)

      return () => {
        marker.removeEventListener('click', handleOnClick)
      }
    }

    return () => {}
  }, [marker, map, coordinate, getMarkerTitle, opacity, getMarkerIcon, onPress, identifier])

  useEffect(() => {
    if (marker) {
      marker.setOpacity(opacity || 1)
    }
  }, [opacity])

  useEffect(() => {
    if (marker && (image || icon)) {
      const newIcon = getMarkerIcon()

      if (newIcon) {
        marker.setIcon(newIcon)
      }
    }
  }, [getMarkerIcon])

  useEffect(() => {
    if (marker) {
      marker.setLatLng(latLngToLeafletLatLng(coordinate))
    }
  }, [coordinate])

  useEffect(() => {
    return () => {
      if (marker) {
        marker.remove()
        setMarker(undefined)
      }
    }
  }, [marker])

  return null
}

export default memo(Marker)
