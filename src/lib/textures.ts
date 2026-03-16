import * as THREE from 'three';
import type { TexturePreset } from './types';

function makeCanvas(size = 256) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2D canvas unavailable');
  return { canvas, ctx };
}

export function createTexture(preset: TexturePreset): THREE.CanvasTexture | null {
  if (preset === 'none') return null;

  const { canvas, ctx } = makeCanvas();

  if (preset === 'brushedMetal') {
    ctx.fillStyle = '#a8adb6';
    ctx.fillRect(0, 0, 256, 256);
    for (let y = 0; y < 256; y += 2) {
      const shade = 150 + Math.floor(Math.random() * 50);
      ctx.strokeStyle = `rgba(${shade}, ${shade}, ${shade}, 0.35)`;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(256, y + Math.random() * 2);
      ctx.stroke();
    }
  }

  if (preset === 'plasticGrain') {
    ctx.fillStyle = '#7e94ad';
    ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 2400; i += 1) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const alpha = 0.03 + Math.random() * 0.12;
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fillRect(x, y, 1.5, 1.5);
    }
  }

  if (preset === 'rubberDots') {
    ctx.fillStyle = '#2d3139';
    ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    for (let x = 12; x < 256; x += 24) {
      for (let y = 12; y < 256; y += 24) {
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  if (preset === 'gradient') {
    const gradient = ctx.createLinearGradient(0, 0, 256, 256);
    gradient.addColorStop(0, '#ff7a18');
    gradient.addColorStop(0.5, '#af52de');
    gradient.addColorStop(1, '#3dd5f3');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.repeat.set(2, 2);
  texture.needsUpdate = true;
  return texture;
}
