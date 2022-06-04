import type { NativeSyntheticEvent, ViewProps } from "react-native";

export interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface LatLng {
  latitude: number;
  longitude: number;
}

export interface Point {
  x: number;
  y: number;
}

export type EventActionType =
    | 'marker-press'
    | 'polygon-press'
    | 'polyline-press'
    | 'callout-press'
    | 'press'
    | 'long-press'
    | 'overlay-press'
    | undefined;

export interface MapEvent<T = {}>
    extends NativeSyntheticEvent<
      T & {
        coordinate: LatLng;
        position: Point;
        action: EventActionType;
        id?: string;
      }
    > {}

export interface MapViewProps extends ViewProps {
  region?: Region;
  initialRegion?: Region;
  minZoomLevel?: number;
  maxZoomLevel?: number;

  onMapLoaded?: () => void;
  onMapReady?: () => void;
  onRegionChange?: (region: Region, details?: { isGesture: boolean }) => void;
  onRegionChangeComplete?: (
    region: Region,
    details?: { isGesture: boolean }
  ) => void;
  onPanDrag?: (event: MapEvent) => void;
}
