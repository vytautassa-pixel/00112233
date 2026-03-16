import { ChangeEvent } from 'react';
import { ControlSection } from './ControlSection';
import { loadSvgFromUrl } from '../lib/svg';
import { useEditorStore } from '../state';
import type { AnimationPreset, EnvironmentPreset, LightingPreset, MaterialPreset, TexturePreset } from '../lib/types';

const demoSvgs = [
  { name: 'Star', url: `${import.meta.env.BASE_URL}demo-svg/star.svg` },
  { name: 'Badge', url: `${import.meta.env.BASE_URL}demo-svg/badge.svg` },
  { name: 'Flower', url: `${import.meta.env.BASE_URL}demo-svg/flower.svg` },
];

export function Sidebar() {
  const state = useEditorStore();

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      state.setSvgText(text, file.name);
    } catch {
      state.setError('Could not read the uploaded SVG file.');
    }
  };

  const loadDemo = async (url: string, name: string) => {
    try {
      const text = await loadSvgFromUrl(url);
      state.setSvgText(text, `${name.toLowerCase()}.svg`);
    } catch {
      state.setError('Could not load the demo SVG.');
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <p className="eyebrow">Lovable-ready starter</p>
        <h1>SVG Extrusion Studio</h1>
        <p className="muted">Upload an SVG, extrude it in 3D, tune materials, lighting, and animation, then deploy straight from GitHub.</p>
      </div>

      <ControlSection title="Import">
        <label className="button-like">
          Upload SVG
          <input type="file" accept=".svg,image/svg+xml" onChange={handleFileUpload} hidden />
        </label>
        <label>
          SVG Markup
          <textarea value={state.svgText} onChange={(e) => state.setSvgText(e.target.value, state.fileName)} rows={8} />
        </label>
        <div className="button-row wrap">
          {demoSvgs.map((item) => (
            <button key={item.name} onClick={() => loadDemo(item.url, item.name)}>{item.name}</button>
          ))}
        </div>
      </ControlSection>

      <ControlSection title="Extrusion">
        <Range label="Depth" min={2} max={80} step={1} value={state.extrusion.depth} onChange={(v) => state.setExtrusion({ depth: v })} />
        <label className="checkbox-row">
          <input type="checkbox" checked={state.extrusion.bevelEnabled} onChange={(e) => state.setExtrusion({ bevelEnabled: e.target.checked })} />
          Bevel enabled
        </label>
        <Range label="Bevel Size" min={0} max={8} step={0.25} value={state.extrusion.bevelSize} onChange={(v) => state.setExtrusion({ bevelSize: v })} />
        <Range label="Bevel Thickness" min={0} max={8} step={0.25} value={state.extrusion.bevelThickness} onChange={(v) => state.setExtrusion({ bevelThickness: v })} />
        <Range label="Bevel Segments" min={0} max={10} step={1} value={state.extrusion.bevelSegments} onChange={(v) => state.setExtrusion({ bevelSegments: v })} />
        <Range label="Curve Smoothness" min={2} max={24} step={1} value={state.extrusion.curveSegments} onChange={(v) => state.setExtrusion({ curveSegments: v })} />
      </ControlSection>

      <ControlSection title="Material">
        <Select<MaterialPreset>
          label="Preset"
          value={state.materialPreset}
          options={['metal', 'glass', 'plastic', 'rubber']}
          onChange={state.setMaterialPreset}
        />
        <label>
          Color
          <input type="color" value={state.materialColor} onChange={(e) => state.setMaterialValue('materialColor', e.target.value)} />
        </label>
        <Range label="Metalness" min={0} max={1} step={0.01} value={state.metalness} onChange={(v) => state.setMaterialValue('metalness', v)} />
        <Range label="Roughness" min={0} max={1} step={0.01} value={state.roughness} onChange={(v) => state.setMaterialValue('roughness', v)} />
        <Range label="Transmission" min={0} max={1} step={0.01} value={state.transmission} onChange={(v) => state.setMaterialValue('transmission', v)} />
        <Range label="Opacity" min={0.05} max={1} step={0.01} value={state.opacity} onChange={(v) => state.setMaterialValue('opacity', v)} />
        <Range label="IOR" min={1} max={2.5} step={0.01} value={state.ior} onChange={(v) => state.setMaterialValue('ior', v)} />
        <Range label="Clearcoat" min={0} max={1} step={0.01} value={state.clearcoat} onChange={(v) => state.setMaterialValue('clearcoat', v)} />
      </ControlSection>

      <ControlSection title="Textures">
        <Select<TexturePreset>
          label="Texture"
          value={state.texturePreset}
          options={['none', 'brushedMetal', 'plasticGrain', 'rubberDots', 'gradient']}
          onChange={state.setTexturePreset}
        />
      </ControlSection>

      <ControlSection title="Environment & Lighting">
        <Select<EnvironmentPreset>
          label="HDR Environment"
          value={state.environmentPreset}
          options={['studio', 'sunset', 'warehouse', 'forest']}
          onChange={state.setEnvironmentPreset}
        />
        <Range label="Environment Intensity" min={0} max={3} step={0.05} value={state.environmentIntensity} onChange={(v) => useEditorStore.setState({ environmentIntensity: v })} />
        <label className="checkbox-row">
          <input type="checkbox" checked={state.useEnvironmentBackground} onChange={(e) => state.setToggle('useEnvironmentBackground', e.target.checked)} />
          Show HDR background
        </label>
        <Select<LightingPreset>
          label="Lighting Preset"
          value={state.lightingPreset}
          options={['studio', 'spotlight', 'dramatic']}
          onChange={state.setLightingPreset}
        />
      </ControlSection>

      <ControlSection title="Animation & Interaction">
        <Select<AnimationPreset>
          label="Animation"
          value={state.animationPreset}
          options={['none', 'turntableSlow', 'turntableMedium', 'turntableFast', 'float']}
          onChange={state.setAnimationPreset}
        />
        <Range label="Animation Speed" min={0.1} max={2} step={0.05} value={state.animationSpeed} onChange={state.setAnimationSpeed} />
        <label className="checkbox-row">
          <input type="checkbox" checked={state.hoverTilt} onChange={(e) => state.setToggle('hoverTilt', e.target.checked)} />
          Hover tilt
        </label>
        <label className="checkbox-row">
          <input type="checkbox" checked={state.hoverGlow} onChange={(e) => state.setToggle('hoverGlow', e.target.checked)} />
          Hover glow
        </label>
        <label className="checkbox-row">
          <input type="checkbox" checked={state.mouseFollowLight} onChange={(e) => state.setToggle('mouseFollowLight', e.target.checked)} />
          Cursor-follow light
        </label>
      </ControlSection>
    </aside>
  );
}

function Range(props: { label: string; min: number; max: number; step: number; value: number; onChange: (value: number) => void }) {
  return (
    <label>
      <span className="row-between"><span>{props.label}</span><span>{props.value.toFixed(props.step < 1 ? 2 : 0)}</span></span>
      <input type="range" min={props.min} max={props.max} step={props.step} value={props.value} onChange={(e) => props.onChange(Number(e.target.value))} />
    </label>
  );
}

function Select<T extends string>(props: { label: string; value: T; options: readonly T[]; onChange: (value: T) => void }) {
  return (
    <label>
      {props.label}
      <select value={props.value} onChange={(e) => props.onChange(e.target.value as T)}>
        {props.options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}
