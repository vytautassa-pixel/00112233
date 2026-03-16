# SVG Extrusion Studio

A simple React + Vite + React Three Fiber starter for turning SVG shapes into extruded 3D objects.

## Features

- Upload an SVG file or paste raw SVG markup
- Live 2D preview and 3D extruded preview
- Extrusion controls: depth, bevel, bevel thickness, bevel segments, curve smoothness
- HDR environment presets
- Lighting presets including spotlight and area-light style setup
- Material presets: metal, glass, plastic, rubber
- Small procedural texture library
- Built-in animation presets including turntable
- Hover tilt and hover glow interaction
- PNG export
- GitHub Pages deployment workflows

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy to GitHub Pages

1. Create a GitHub repo named `svg-extrusion-studio`.
2. Upload all files from this project.
3. Push to the `main` branch.
4. In GitHub repo settings, go to **Pages** and set **Build and deployment** to **GitHub Actions**.
5. The included workflow in `.github/workflows/deploy.yml` will publish the site.

## Important

If you rename the repo, update `repoName` in `vite.config.ts`.

## Suggested next upgrades

- GLB export
- Real HDR files from local assets instead of preset environments
- Multiple SVG object layers
- Saved presets in localStorage
- Advanced light editor

## GitHub Pages note
This project auto-detects the GitHub repository name during the GitHub Actions build using `GITHUB_REPOSITORY`, so asset paths should work even if you rename the repo. If you deploy to a custom domain or to the root `username.github.io` repo, change the Vite `base` value in `vite.config.ts` to `'/'`.
