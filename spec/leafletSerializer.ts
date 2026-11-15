import { LatLng, LatLngBounds } from 'leaflet';
import type { SnapshotSerializer } from 'vite-plus/test';

/**
 * Serializes LatLng/LatLngBounds as plain objects, so snapshots match for Leaflet 1.x
 * (prototype-based, constructor is Object) and Leaflet 2.x (ES classes).
 */
export default {
  test: (val: unknown) => val instanceof LatLng || val instanceof LatLngBounds,
  serialize: (val, config, indentation, depth, refs, printer) =>
    printer({ ...val }, config, indentation, depth, refs)
} satisfies SnapshotSerializer;
