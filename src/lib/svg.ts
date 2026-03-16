import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';

export function parseSvgToShapes(svgText: string): THREE.Shape[] {
  const loader = new SVGLoader();
  const data = loader.parse(svgText);
  const shapes: THREE.Shape[] = [];

  data.paths.forEach((path) => {
    const pathShapes = SVGLoader.createShapes(path);
    shapes.push(...pathShapes);
  });

  if (shapes.length === 0) {
    throw new Error('No supported shapes were found in this SVG.');
  }

  return shapes;
}

export async function loadSvgFromUrl(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load demo SVG: ${response.status}`);
  }
  return response.text();
}
