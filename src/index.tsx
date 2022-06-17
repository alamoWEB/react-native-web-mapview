import React, { Children, cloneElement, FC, forwardRef, memo, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import * as Leaflet from 'leaflet';
import type { Boundaries, Camera, LatLng, MapViewProps } from './types';
import { View } from 'react-native';
import { isValidZoom, latLngToLeafletLatLng, leafletCoordToLatLng } from './util';

const MapView: FC<MapViewProps> = forwardRef(({style, region, initialRegion, maxZoomLevel, minZoomLevel, children, onMapReady, onRegionChange, onRegionChangeComplete, onPanDrag}, ref) => {
  const mapContainerRef = useRef<HTMLDivElement>(null)

  const [map, setMap] = useState<Leaflet.Map>()

  const [center, setCenter] = useState<LatLng>({
    latitude: region?.latitude ?? initialRegion!.latitude,
    longitude: region?.longitude ?? initialRegion!.longitude
  })

  useImperativeHandle(ref, () => ({
    getMap: (): Leaflet.Map | undefined => {
      return map
    },

    getMapBoundaries: async (): Promise<Boundaries | null> => {
      if (!map) {
        return null
      }

      const bounds = map.getBounds()

      return {
        northEast: leafletCoordToLatLng(bounds.getNorthEast()),
        southWest: leafletCoordToLatLng(bounds.getSouthWest())
      }
    },

    getCamera: async (): Promise<Camera | null> => {
      if (!map) {
        return null
      }

      return {
        center: leafletCoordToLatLng(map.getCenter()),
        heading: 0,
        pitch: 0,
        altitude: 0,
        zoom: map.getZoom(),
      }
    },

    setCamera: async (camera: Camera) => {
      if (map) {
        if (camera.zoom !== map.getZoom()) {
          map.setZoom(
            isValidZoom(maxZoomLevel) && camera.zoom > maxZoomLevel! 
              ? maxZoomLevel! 
              : (
                isValidZoom(minZoomLevel) && camera.zoom < minZoomLevel! 
                ? minZoomLevel! 
                : camera.zoom
              )
          )
        }
      }
    }
  }), [map])

  useEffect(() => {
    if (region && (region.latitude !== center.latitude || region.longitude !== center.longitude)) {
      setCenter({
        latitude: region.latitude,
        longitude: region.longitude
      })

      if (map) {
        map.panTo(latLngToLeafletLatLng(region))
      }
    }
  }, [region])

  useLayoutEffect(() => {
    if (mapContainerRef.current && !map) {
      const defaultZoom = 16

      setMap(new Leaflet.Map(mapContainerRef.current, {
        layers: [
          Leaflet.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          }),
        ],
        center: latLngToLeafletLatLng(center),
        zoom: maxZoomLevel && defaultZoom > maxZoomLevel ? maxZoomLevel : (minZoomLevel && defaultZoom < minZoomLevel ? minZoomLevel : defaultZoom),
        minZoom: minZoomLevel,
        maxZoom: maxZoomLevel
      }))
    }
  }, [mapContainerRef.current, map, center, maxZoomLevel, minZoomLevel])

  useEffect(() => {
    if (map) {
      const handleOnLoad = () => {
        if (onMapReady) {
          onMapReady()
        }
      }

      const handleOnDragOrMove = (event: Leaflet.LeafletEvent) => {
        const center = leafletCoordToLatLng(map.getCenter())

        if (onPanDrag) {
          onPanDrag({
            ...event,
            coordinate: center
          })
        }

        if (onRegionChange) {
          onRegionChange({
            ...center,
            latitudeDelta: 0,
            longitudeDelta: 0
          })
        }
      }
      
      const handleOnDragOrMoveEnd = () => {
        const center = leafletCoordToLatLng(map.getCenter())

        if (onRegionChangeComplete) {
          onRegionChangeComplete({
            ...center,
            latitudeDelta: 0,
            longitudeDelta: 0
          })
        }
      }

      map.addEventListener('load', handleOnLoad)

      map.addEventListener('drag', handleOnDragOrMove)
      map.addEventListener('move', handleOnDragOrMove)
      map.addEventListener('dragend', handleOnDragOrMoveEnd)
      map.addEventListener('moveend', handleOnDragOrMoveEnd)

      return () => {
        map.removeEventListener('load', handleOnLoad)
        map.removeEventListener('drag', handleOnDragOrMove)
        map.removeEventListener('move', handleOnDragOrMove)
        map.removeEventListener('dragend', handleOnDragOrMoveEnd)
        map.removeEventListener('moveend', handleOnDragOrMoveEnd)
      }
    }

    return () => {}
  }, [map, onMapReady, onPanDrag, onRegionChange, onRegionChangeComplete])

  useEffect(() => {
    return () => {
      if (map) {
        map.remove()
        setMap(undefined)
      }
    }
  }, [map])

  return (
    <View
      style={style ?? {
        height: '100%',
      }}
    >
      <div ref={mapContainerRef} style={{flex: 1}}>
        {Children.map(children, (child: any) => cloneElement(child, {
          map
        }))}
      </div>
    </View>
  );
})

export default memo(MapView);

export { default as Marker} from './Marker';
