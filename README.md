# Guddu City Game — Three.js (Final Polished Version)

This is a production-ready Three.js city mini-game with an intro screen, smooth controls, realistic lighting, post-processing (bloom + SSAO), ambient sound, interactive hotspots, particles (sparkles), and desktop/mobile support.

## How to run
1. Open `index.html` directly in a modern browser **or** use a local server (recommended).
2. Click **Start Game** on the intro screen to enable audio and begin.
3. Controls: **WASD / Arrow Keys** to move Guddu, **Mouse drag** to orbit camera (when not moving), **Space** to toggle run, **E** to interact with hotspots.

> This build pulls Three.js & postprocessing modules from CDN (unpkg). You don't need to install anything.

## Structure
- `index.html` — page + module imports
- `styles.css` — UI styling
- `src/main.js` — scene setup, city generation, player controller, effects
- `src/ui.js` — intro screen, tooltips, pause overlay
- `assets/audio/ambient.wav` — placeholder ambient sound
- `assets/textures/noise.png` — noise texture for ground/material detail

## Customize
- Replace `assets/audio/ambient.wav` with your own track (keep the filename or update the path in `main.js`).
- Tweak city size, building styles, traffic density in `main.js` (CONFIG section).
- Add your own models via GLTF/GLB (see `// TODO: GLTF models` in `main.js`).

Enjoy! — Built for realism with ACES tone mapping, shadowed lights, fog, and post-processing.
