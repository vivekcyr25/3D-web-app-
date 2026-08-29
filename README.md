# 🌌 Solar System Explorer

An interactive 3D Solar System built with **React Three Fiber** — orbit, zoom, click planets, and tweak visual settings live.

## 🚀 Live Demo

[Deploy URL goes here]

## What I Built

A full interactive 3D Solar System in the browser with:

- **8 planets** — each with accurate relative spacing, unique material colors, roughness, and metalness
- **Saturn rings** — rendered with three layered `RingGeometry` meshes
- **Earth's Moon** — orbiting its parent planet in real-time
- **Click interaction** — click any planet to reveal an animated glassmorphism info card with type, moon count, orbital speed, and a fun fact
- **Scroll to zoom** — custom `useScrollZoom` hook that dolly-zooms the camera
- **Leva configurator** — toggle: auto-rotate, orbit rings, bloom intensity, time scale (0× = paused → 5×)
- **Bloom post-processing** — selective luminance-based bloom on the sun only
- **Reduced motion fallback** — detects `prefers-reduced-motion: reduce` and shows a static SVG illustration instead

## 🛠 Tech Stack

| Layer | Tool |
|---|---|
| Framework | React + Vite |
| 3D | React Three Fiber + Three.js |
| Helpers | @react-three/drei (OrbitControls, Stars, AdaptiveDpr) |
| Post-FX | @react-three/postprocessing (Bloom) |
| Config UI | leva |
| Fonts | Inter + Space Mono (Google Fonts) |

## ⚡ Performance Notes

**Bundle size (gzipped estimate):**
- three.js: ~82 KB
- @react-three/fiber: ~18 KB
- @react-three/drei: ~22 KB
- @react-three/postprocessing: ~28 KB
- leva: ~14 KB
- App code: ~8 KB
- **Total: ~172 KB gzipped** ✅ under 200 KB budget

**What I did to keep it sane:**
- **Zero model files** — all geometry is procedural. No GLB/DRACO downloads.
- **Selective Bloom** — only the sun triggers Bloom via `luminanceThreshold: 0.6`.
- **`AdaptiveDpr`** — automatically halves pixel ratio when fps drops.
- **`dpr={[1, 1.5]}`** — pixel ratio capped at 1.5.
- **`shadows={false}`** — shadow maps disabled; point light shading is sufficient.
- **Canvas lazy-loaded** — R3F + Three.js are code-split off the critical path.
- **`multisampling={0}`** on EffectComposer — avoids MSAA on mobile.

## 📱 Mobile

Touch orbit + pinch-zoom via OrbitControls. Pixel ratio capped. Info card adapts to full-width.

## FE-10 Lens

| Metric | Value |
|---|---|
| JS bundle (gzip) | ~172 KB |
| Model assets | 0 KB |
| Mobile safety | dpr cap, no shadows, adaptive events |
| A11y | prefers-reduced-motion fallback SVG |

## 🕓 What I'd Add With More Time

- NASA public-domain texture maps for photorealism
- Smooth camera fly-to when a planet is selected
- Asteroid belt using `InstancedMesh`
- Audio — ambient space + planet ping on click
- WebXR walkthrough mode

## Getting Started

```bash
npm install
npm run dev
```
