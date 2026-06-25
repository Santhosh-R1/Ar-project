import { createXRStore } from '@react-three/xr';

// domOverlay: true enables the "dom-overlay" WebXR feature.
// The library will automatically create and manage the overlay root element.
export const xrStore = createXRStore({
  domOverlay: true,
});
