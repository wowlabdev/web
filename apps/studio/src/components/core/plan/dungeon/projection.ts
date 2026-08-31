// Leaflet L.CRS.Simple: LatLng(lat, lng) → scene px (lng * 2^zoom, -lat * 2^zoom).

import type { Vec2 } from "@/components/shared/canvas";
import type { Vertex } from "@/lib/zod";

export function project(latLng: Vertex, zoom: number): Vec2 {
  const s = Math.pow(2, zoom);

  return { x: latLng.lng * s, y: -latLng.lat * s };
}
