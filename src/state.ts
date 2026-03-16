import { create } from 'zustand';
import type {
  AnimationPreset,
  EnvironmentPreset,
  ExtrusionSettings,
  LightingPreset,
  MaterialPreset,
  TexturePreset,
} from './lib/types';
import { getMaterialValues } from './lib/materials';

const materialDefaults = getMaterialValues('metal');

export type EditorState = {
  svgText: string;
  fileName: string;
  extrusion: ExtrusionSettings;
  materialPreset: MaterialPreset;
  materialColor: string;
  metalness: number;
  roughness: number;
  transmission: number;
  opacity: number;
  ior: number;
  clearcoat: number;
  environmentPreset: EnvironmentPreset;
  environmentIntensity: number;
  useEnvironmentBackground: boolean;
  lightingPreset: LightingPreset;
  texturePreset: TexturePreset;
  animationPreset: AnimationPreset;
  animationSpeed: number;
  hoverTilt: boolean;
  hoverGlow: boolean;
  mouseFollowLight: boolean;
  autoRotate: boolean;
  error: string;
  setSvgText: (svgText: string, fileName?: string) => void;
  setExtrusion: (patch: Partial<ExtrusionSettings>) => void;
  setMaterialPreset: (preset: MaterialPreset) => void;
  setMaterialValue: (key: 'materialColor' | 'metalness' | 'roughness' | 'transmission' | 'opacity' | 'ior' | 'clearcoat', value: string | number) => void;
  setEnvironmentPreset: (preset: EnvironmentPreset) => void;
  setLightingPreset: (preset: LightingPreset) => void;
  setTexturePreset: (preset: TexturePreset) => void;
  setAnimationPreset: (preset: AnimationPreset) => void;
  setAnimationSpeed: (speed: number) => void;
  setToggle: (key: 'hoverTilt' | 'hoverGlow' | 'mouseFollowLight' | 'useEnvironmentBackground' | 'autoRotate', value: boolean) => void;
  setError: (message: string) => void;
};

export const defaultSvg = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M100 10 L124 72 L190 78 L140 122 L154 188 L100 152 L46 188 L60 122 L10 78 L76 72 Z" fill="#000"/></svg>`;

export const useEditorStore = create<EditorState>((set) => ({
  svgText: defaultSvg,
  fileName: 'demo-star.svg',
  extrusion: {
    depth: 26,
    bevelEnabled: true,
    bevelSize: 2,
    bevelThickness: 2,
    bevelSegments: 4,
    curveSegments: 10,
  },
  materialPreset: 'metal',
  materialColor: materialDefaults.color,
  metalness: materialDefaults.metalness,
  roughness: materialDefaults.roughness,
  transmission: materialDefaults.transmission,
  opacity: materialDefaults.opacity,
  ior: materialDefaults.ior,
  clearcoat: materialDefaults.clearcoat,
  environmentPreset: 'studio',
  environmentIntensity: 1,
  useEnvironmentBackground: true,
  lightingPreset: 'studio',
  texturePreset: 'none',
  animationPreset: 'turntableSlow',
  animationSpeed: 0.5,
  hoverTilt: true,
  hoverGlow: true,
  mouseFollowLight: false,
  autoRotate: true,
  error: '',
  setSvgText: (svgText, fileName = 'custom.svg') => set({ svgText, fileName, error: '' }),
  setExtrusion: (patch) => set((state) => ({ extrusion: { ...state.extrusion, ...patch } })),
  setMaterialPreset: (preset) => {
    const values = getMaterialValues(preset);
    set({
      materialPreset: preset,
      materialColor: values.color,
      metalness: values.metalness,
      roughness: values.roughness,
      transmission: values.transmission,
      opacity: values.opacity,
      ior: values.ior,
      clearcoat: values.clearcoat,
    });
  },
  setMaterialValue: (key, value) => set({ [key]: value } as Pick<EditorState, typeof key>),
  setEnvironmentPreset: (preset) => set({ environmentPreset: preset }),
  setLightingPreset: (preset) => set({ lightingPreset: preset }),
  setTexturePreset: (preset) => set({ texturePreset: preset }),
  setAnimationPreset: (preset) => set({ animationPreset: preset, autoRotate: preset !== 'none' }),
  setAnimationSpeed: (speed) => set({ animationSpeed: speed }),
  setToggle: (key, value) => set({ [key]: value } as Pick<EditorState, typeof key>),
  setError: (message) => set({ error: message }),
}));
