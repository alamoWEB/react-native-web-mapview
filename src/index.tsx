import React, { FC, forwardRef, memo, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import * as Leaflet from 'leaflet';
import type { LatLng, MapViewProps } from './types';
import { View } from 'react-native';

const MapView: FC<MapViewProps> = forwardRef(({style, region, initialRegion, maxZoomLevel, minZoomLevel}, ref) => {
  const mapContainerRef = useRef<HTMLDivElement>(null)

  const [map, setMap] = useState<Leaflet.Map>()

  const [center, setCenter] = useState<LatLng>({
    latitude: region?.latitude ?? initialRegion!.latitude,
    longitude: region?.longitude ?? initialRegion!.longitude
  })

  useImperativeHandle(ref, () => ({
    getMapBoundaries: async () => {
      if (!map) {
        return null
      }

      const bounds = map.getBounds()

      const northEast = bounds.getNorthEast()
      const southWest = bounds.getNorthEast()

      return {
        northEast: {
          latitude: northEast.lat,
          longiture: northEast.lng
        },
        southWest: {
          latitude: southWest.lat,
          longiture: southWest.lng
        }
      }
    },
  }), [map])

  useEffect(() => {
    if (region && (region.latitude !== center.latitude || region.longitude !== center.longitude)) {
      setCenter({
        latitude: region.latitude,
        longitude: region.longitude
      })

      if (map) {
        map.panTo(new Leaflet.LatLng(region.latitude, region.longitude))
      }
    }
  }, [region, center])

  useLayoutEffect(() => {
    if (mapContainerRef.current && !map) {
      const defaultZoom = 13

      setMap(new Leaflet.Map(mapContainerRef.current, {
        layers: [
          Leaflet.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          }),
        ],
        center: new Leaflet.LatLng(center.latitude, center.longitude),
        zoom: maxZoomLevel && defaultZoom > maxZoomLevel ? maxZoomLevel : (minZoomLevel && defaultZoom < minZoomLevel ? minZoomLevel : defaultZoom),
        minZoom: minZoomLevel,
        maxZoom: maxZoomLevel
      }))
    }
  }, [mapContainerRef.current, map, center, maxZoomLevel, minZoomLevel])

  return (
    <View
      style={style ?? {
        height: '100%',
      }}
    >
      <div ref={mapContainerRef}></div>
    </View>
  );
})

export default memo(MapView);

// export { default as Marker} from './Marker';
