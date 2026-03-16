import type { MaterialPreset } from './types';

export function getMaterialValues(preset: MaterialPreset) {
  switch (preset) {
    case 'metal':
      return {
        color: '#d7d9dd',
        metalness: 1,
        roughness: 0.24,
        transmission: 0,
        opacity: 1,
        ior: 1.5,
        clearcoat: 0.2,
      };
    case 'glass':
      return {
        color: '#dff8ff',
        metalness: 0,
        roughness: 0.03,
        transmission: 1,
        opacity: 0.35,
        ior: 1.45,
        clearcoat: 0.9,
      };
    case 'rubber':
      return {
        color: '#23262d',
        metalness: 0,
        roughness: 0.92,
        transmission: 0,
        opacity: 1,
        ior: 1.3,
        clearcoat: 0,
      };
    case 'plastic':
    default:
      return {
        color: '#6ea8ff',
        metalness: 0.05,
        roughness: 0.45,
        transmission: 0,
        opacity: 1,
        ior: 1.45,
        clearcoat: 0.25,
      };
  }
}
