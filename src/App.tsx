import { useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { SceneCanvas } from './components/SceneCanvas';
import { useEditorStore } from './state';

export default function App() {
  const fileName = useEditorStore((state) => state.fileName);
  const error = useEditorStore((state) => state.error);
  const previewRef = useRef<HTMLDivElement>(null);
  const svgText = useEditorStore((state) => state.svgText);

  const exportMarkup = () => {
    const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || 'scene.svg';
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportPng = async () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = 'extrusion-render.png';
    link.click();
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-panel">
        <div className="topbar">
          <div>
            <p className="eyebrow">Current SVG</p>
            <strong>{fileName}</strong>
          </div>
          <div className="button-row">
            <button onClick={exportMarkup}>Download SVG</button>
            <button className="accent" onClick={exportPng}>Export PNG</button>
          </div>
        </div>

        {error ? <div className="error-banner">{error}</div> : null}

        <div className="workspace-grid">
          <SceneCanvas />
          <div className="preview-panel" ref={previewRef}>
            <div className="preview-header">
              <span>2D SVG Preview</span>
            </div>
            <div className="svg-preview" dangerouslySetInnerHTML={{ __html: svgText }} />
          </div>
        </div>
      </main>
    </div>
  );
}
