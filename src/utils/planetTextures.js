import * as THREE from "three";

/**
 * Seeded pseudo-random for deterministic textures
 */
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function drawNoiseLayer(ctx, size, color, alpha, count, maxR, seed) {
  const rng = seededRandom(seed);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  for (let i = 0; i < count; i++) {
    const x = rng() * size;
    const y = rng() * size;
    const r = rng() * maxR + 2;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawBands(ctx, size, bands) {
  const bandH = size / bands.length;
  bands.forEach((color, i) => {
    const grad = ctx.createLinearGradient(0, i * bandH, 0, (i + 1) * bandH);
    grad.addColorStop(0, color);
    grad.addColorStop(0.5, color);
    grad.addColorStop(1, bands[(i + 1) % bands.length]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, i * bandH, size, bandH + 2);
  });
}

const TEXTURES = {
  mercury: (ctx, size) => {
    ctx.fillStyle = "#9a9a9a";
    ctx.fillRect(0, 0, size, size);
    drawNoiseLayer(ctx, size, "#777", 0.6, 60, 15, 1);
    drawNoiseLayer(ctx, size, "#b0b0b0", 0.4, 80, 10, 2);
    drawNoiseLayer(ctx, size, "#666", 0.3, 40, 20, 3);
    // Craters
    const rng = seededRandom(11);
    ctx.globalAlpha = 0.35;
    for (let i = 0; i < 20; i++) {
      const cx = rng() * size, cy = rng() * size, r = rng() * 14 + 4;
      ctx.strokeStyle = "#555";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "#888";
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  },

  venus: (ctx, size) => {
    const base = ctx.createLinearGradient(0, 0, size, size);
    base.addColorStop(0, "#e8cda0");
    base.addColorStop(0.5, "#d4b080");
    base.addColorStop(1, "#f0d8b0");
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, size, size);
    // Swirling cloud layers
    drawNoiseLayer(ctx, size, "#c8a060", 0.3, 50, 30, 10);
    drawNoiseLayer(ctx, size, "#f0e0a0", 0.25, 40, 25, 11);
    drawNoiseLayer(ctx, size, "#b89060", 0.2, 35, 20, 12);
    // Horizontal streaks
    const rng = seededRandom(13);
    ctx.globalAlpha = 0.15;
    for (let i = 0; i < 20; i++) {
      const y = rng() * size;
      const grad = ctx.createLinearGradient(0, y, size, y + 8);
      grad.addColorStop(0, "transparent");
      grad.addColorStop(0.5, "#a87840");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.fillRect(0, y, size, rng() * 8 + 2);
    }
    ctx.globalAlpha = 1;
  },

  earth: (ctx, size) => {
    // Ocean
    const ocean = ctx.createLinearGradient(0, 0, 0, size);
    ocean.addColorStop(0, "#1a6ba0");
    ocean.addColorStop(1, "#0e4d7a");
    ctx.fillStyle = ocean;
    ctx.fillRect(0, 0, size, size);

    // Land masses (seeded blobs)
    const rng = seededRandom(42);
    const landColors = ["#3a7d44", "#4a8f50", "#2d6e38", "#5a9e5e", "#6ab870", "#8b6914", "#7a5c0e"];
    ctx.globalAlpha = 0.92;
    for (let i = 0; i < 18; i++) {
      const cx = rng() * size, cy = rng() * size;
      const rx = rng() * 60 + 20, ry = rng() * 40 + 15;
      ctx.fillStyle = landColors[i % landColors.length];
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, rng() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }
    // Forests/variation on land
    drawNoiseLayer(ctx, size, "#2d5e30", 0.3, 40, 18, 43);
    drawNoiseLayer(ctx, size, "#6b9e6b", 0.2, 30, 12, 44);

    ctx.globalAlpha = 1;

    // Polar ice caps
    const northGrad = ctx.createLinearGradient(0, 0, 0, size * 0.18);
    northGrad.addColorStop(0, "rgba(240,248,255,0.98)");
    northGrad.addColorStop(1, "rgba(220,240,255,0)");
    ctx.fillStyle = northGrad;
    ctx.fillRect(0, 0, size, size * 0.18);

    const southGrad = ctx.createLinearGradient(0, size, 0, size * 0.82);
    southGrad.addColorStop(0, "rgba(240,248,255,0.98)");
    southGrad.addColorStop(1, "rgba(220,240,255,0)");
    ctx.fillStyle = southGrad;
    ctx.fillRect(0, size * 0.82, size, size * 0.18);

    // Cloud layer
    drawNoiseLayer(ctx, size, "rgba(255,255,255,0.6)", 0.35, 30, 35, 45);
  },

  mars: (ctx, size) => {
    const base = ctx.createLinearGradient(0, 0, 0, size);
    base.addColorStop(0, "#c1440e");
    base.addColorStop(1, "#8b2e00");
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, size, size);

    drawNoiseLayer(ctx, size, "#a03000", 0.4, 60, 30, 20);
    drawNoiseLayer(ctx, size, "#d45a20", 0.3, 50, 20, 21);
    drawNoiseLayer(ctx, size, "#7a2000", 0.3, 40, 25, 22);

    // Craters
    const rng = seededRandom(23);
    ctx.globalAlpha = 0.4;
    for (let i = 0; i < 15; i++) {
      const cx = rng() * size, cy = rng() * size * 0.8 + size * 0.1;
      const r = rng() * 12 + 5;
      ctx.strokeStyle = "#6a1800";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "#b03800";
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Polar ice caps
    const northGrad = ctx.createLinearGradient(0, 0, 0, size * 0.12);
    northGrad.addColorStop(0, "rgba(240,248,255,0.95)");
    northGrad.addColorStop(1, "rgba(240,248,255,0)");
    ctx.fillStyle = northGrad;
    ctx.fillRect(0, 0, size, size * 0.12);
  },

  jupiter: (ctx, size) => {
    const bands = [
      "#c88b3a","#d4a055","#8b5520","#e8c87a","#b07030",
      "#d4a055","#c07828","#e0c068","#8b5520","#c88b3a",
      "#d4a055","#8b5520",
    ];
    drawBands(ctx, size, bands);

    // Turbulence swirls
    const rng = seededRandom(50);
    ctx.globalAlpha = 0.18;
    for (let i = 0; i < 25; i++) {
      const cx = rng() * size, cy = rng() * size;
      const rx = rng() * 50 + 20, ry = rng() * 10 + 5;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rx);
      grad.addColorStop(0, "#f0d880");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Great Red Spot
    const grs = ctx.createRadialGradient(size * 0.65, size * 0.58, 0, size * 0.65, size * 0.58, 45);
    grs.addColorStop(0, "#c1440e");
    grs.addColorStop(0.6, "#a03010");
    grs.addColorStop(1, "transparent");
    ctx.fillStyle = grs;
    ctx.beginPath();
    ctx.ellipse(size * 0.65, size * 0.58, 45, 28, 0, 0, Math.PI * 2);
    ctx.fill();
  },

  saturn: (ctx, size) => {
    const bands = [
      "#e4d191","#d4c070","#f0e0a0","#c8b060",
      "#e8d898","#d0ba60","#ecdea0","#c8b060",
    ];
    drawBands(ctx, size, bands);

    drawNoiseLayer(ctx, size, "#b09030", 0.1, 30, 20, 60);
    drawNoiseLayer(ctx, size, "#f0e8a0", 0.1, 25, 15, 61);
  },

  uranus: (ctx, size) => {
    const base = ctx.createLinearGradient(0, 0, size, size);
    base.addColorStop(0, "#7de8e8");
    base.addColorStop(0.5, "#5ad0d0");
    base.addColorStop(1, "#8aeaea");
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, size, size);
    drawNoiseLayer(ctx, size, "#4ab8c0", 0.15, 20, 40, 70);
    drawNoiseLayer(ctx, size, "#9af0f0", 0.12, 15, 30, 71);
    // Subtle horizontal bands
    const rng = seededRandom(72);
    ctx.globalAlpha = 0.08;
    for (let i = 0; i < 8; i++) {
      const y = rng() * size;
      ctx.fillStyle = "#a0f8f8";
      ctx.fillRect(0, y, size, rng() * 10 + 3);
    }
    ctx.globalAlpha = 1;
  },

  neptune: (ctx, size) => {
    const base = ctx.createLinearGradient(0, 0, size, size);
    base.addColorStop(0, "#3f54ba");
    base.addColorStop(0.5, "#2a3d9e");
    base.addColorStop(1, "#4a60cc");
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, size, size);

    // Bands
    drawNoiseLayer(ctx, size, "#1a2e8e", 0.3, 30, 30, 80);
    drawNoiseLayer(ctx, size, "#5a6ed8", 0.2, 25, 20, 81);

    // Great Dark Spot
    const ds = ctx.createRadialGradient(size * 0.35, size * 0.45, 0, size * 0.35, size * 0.45, 38);
    ds.addColorStop(0, "#101880");
    ds.addColorStop(0.7, "#1a2880");
    ds.addColorStop(1, "transparent");
    ctx.fillStyle = ds;
    ctx.beginPath();
    ctx.ellipse(size * 0.35, size * 0.45, 38, 24, 0, 0, Math.PI * 2);
    ctx.fill();

    // White storm streaks
    const rng = seededRandom(82);
    ctx.globalAlpha = 0.18;
    for (let i = 0; i < 12; i++) {
      ctx.fillStyle = "#8080ff";
      ctx.fillRect(rng() * size, rng() * size, rng() * 80 + 20, rng() * 4 + 1);
    }
    ctx.globalAlpha = 1;
  },
};

/**
 * Generate a THREE.CanvasTexture for a given planet.
 * Returns the same texture object if called multiple times (cached).
 */
const cache = new Map();

export function getPlanetTexture(planetId) {
  if (cache.has(planetId)) return cache.get(planetId);

  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  const draw = TEXTURES[planetId];
  if (draw) draw(ctx, size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  cache.set(planetId, tex);
  return tex;
}
