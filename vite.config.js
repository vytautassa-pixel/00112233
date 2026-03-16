import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
var repoName = 'svg-extrusion-studio';
export default defineConfig({
    plugins: [react()],
    base: process.env.NODE_ENV === 'production' ? "/".concat(repoName, "/") : '/',
});
