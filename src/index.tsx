import React, { FC, forwardRef, memo, useEffect, useImperativeHandle, useRef, useState } from 'react';
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
    getBounds: async () => {
      if (!map) {
        return null
      }

      const bounds = map.getBounds()

      return {
        northEast: bounds.getNorthEast(),
        southWest: bounds.getSouthWest()
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
        map.panTo(new Leaflet.LatLng(region.latitude, region.longitude))
      }
    }
  }, [region, center])

  useEffect(() => {
    if (mapContainerRef.current) {
      const defaultZoom = 13

      setMap(new Leaflet.Map(mapContainerRef.current, {
        center: new Leaflet.LatLng(center.latitude, center.longitude),
        zoom: maxZoomLevel && defaultZoom > maxZoomLevel ? maxZoomLevel : (minZoomLevel && defaultZoom < minZoomLevel ? minZoomLevel : defaultZoom),
        minZoom: minZoomLevel,
        maxZoom: maxZoomLevel
      }))
    }
  }, [mapContainerRef.current, center, maxZoomLevel, minZoomLevel])

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
