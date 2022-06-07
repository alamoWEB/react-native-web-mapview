import type { LatLng } from './types';
import { LatLng as LeafletLatLng } from 'leaflet';

export const isValidZoom = (zoom?: number | null): boolean => {
  return zoom !== undefined && zoom !== null && !isNaN(zoom)
}

export const leafletCoordToLatLng = (coord: LeafletLatLng): LatLng => ({
  latitude: coord.lat,
  longitude: coord.lng
})

export const latLngToLeafletLatLng = (coord: LatLng): LeafletLatLng => new LeafletLatLng(coord.latitude, coord.longitude)
