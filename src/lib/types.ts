export type MaterialPreset = 'metal' | 'glass' | 'plastic' | 'rubber';
export type EnvironmentPreset = 'studio' | 'sunset' | 'warehouse' | 'forest';
export type LightingPreset = 'studio' | 'spotlight' | 'dramatic';
export type TexturePreset = 'none' | 'brushedMetal' | 'plasticGrain' | 'rubberDots' | 'gradient';
export type AnimationPreset = 'none' | 'turntableSlow' | 'turntableMedium' | 'turntableFast' | 'float';

export type ExtrusionSettings = {
  depth: number;
  bevelEnabled: boolean;
  bevelSize: number;
  bevelThickness: number;
  bevelSegments: number;
  curveSegments: number;
};
