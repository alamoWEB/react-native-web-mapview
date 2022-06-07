import type { Map } from "leaflet";
import type { ImageURISource, NativeSyntheticEvent, ViewProps } from "react-native";

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

export interface Boundaries {
  northEast: LatLng;
  southWest: LatLng;
}

export interface Camera {
  center: LatLng;
  heading: number;
  pitch: number;
  zoom: number;
  altitude: number;
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

  onMapReady?: () => void;
  onRegionChange?: (region: Region, details?: { isGesture: boolean }) => void;
  onRegionChangeComplete?: (
    region: Region,
    details?: { isGesture: boolean }
  ) => void;
  onPanDrag?: (event: any) => void;
}

export interface MarkerProps extends ViewProps {
  map: Map,
  identifier?: string;
  title?: string;
  description?: string;
  image?: ImageURISource | string;
  icon?: ImageURISource | string;
  opacity?: number;
  coordinate: LatLng;
  anchor?: Point;

  onPress?: (event: any) => void;
}
