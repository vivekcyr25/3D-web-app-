import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Stars,
  Preload,
  AdaptiveDpr,
  AdaptiveEvents,
} from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Leva, useControls, folder } from "leva";
import * as THREE from "three";

import { Sun } from "./Sun";
import { Planet } from "./Planet";
import { PLANETS } from "../data/planets";
import { useScrollZoom } from "../hooks/useScrollZoom";

function SceneControls() {
  useScrollZoom({ min: 10, max: 90, speed: 0.04 });
  return null;
}

function Scene({ timeScale, showOrbits, selectedId, onPlanetClick }) {
  return (
    <>
      <SceneControls />
      <color attach="background" args={["#05071a"]} />
      <fog attach="fog" args={["#05071a", 90, 300]} />

      {/* Low ambient so dark sides aren't pure black */}
      <ambientLight intensity={0.12} color="#1a2060" />

      {/* Cool fill light from opposite side of sun — reveals dark-side texture */}
      <pointLight
        position={[-80, 20, -80]}
        intensity={0.4}
        color="#2040a0"
        distance={300}
        decay={1}
      />

      <Sun />

      {PLANETS.map((planet) => (
        <Planet
          key={planet.id}
          data={planet}
          timeScale={timeScale}
          showOrbits={showOrbits}
          onClick={onPlanetClick}
          isSelected={selectedId === planet.id}
        />
      ))}

      <Stars
        radius={130}
        depth={70}
        count={7000}
        factor={4}
        saturation={0.1}
        fade
        speed={0.4}
      />
    </>
  );
}

export function SolarSystem({ onPlanetClick, selectedId }) {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const { timeScale, showOrbits, bloomIntensity, autoRotate, autoRotateSpeed } =
    useControls({
      "Solar System": folder(
        {
          timeScale: { value: 1.0, min: 0, max: 5, step: 0.1, label: "⏱ Time Scale" },
          showOrbits: { value: true, label: "🪐 Show Orbits" },
          autoRotate: { value: false, label: "🔄 Auto Rotate" },
          autoRotateSpeed: {
            value: 0.5,
            min: 0.1,
            max: 3,
            step: 0.1,
            label: "💫 Rotate Speed",
            render: (get) => get("Solar System.autoRotate"),
          },
          bloomIntensity: {
            value: 1.2,
            min: 0,
            max: 3,
            step: 0.1,
            label: "✨ Sun Bloom",
          },
        },
        { collapsed: isMobile }
      ),
    });

  return (
    <>
      <Leva
        isRoot
        collapsed={isMobile}
        hidden={isMobile}
        titleBar={{ title: "3D Controls" }}
        theme={{
          colors: {
            highlight1: "#f5f7fa",
            highlight2: "#e4e8f0",
            highlight3: "#cbd2e1",
            accent1: "#FDB813",
            accent2: "#FF8C00",
            elevation1: "#0e1329",
            elevation2: "#182042",
            elevation3: "#222c59",
          },
        }}
      />
      <Canvas
        shadows={false}
        camera={{ position: [0, 25, 55], fov: 55, near: 0.5, far: 500 }}
        dpr={[1, isMobile ? 1.25 : 1.5]}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
      }}
      style={{ width: "100%", height: "100%" }}
    >
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />

      <Suspense fallback={null}>
        <Scene
          timeScale={timeScale}
          showOrbits={showOrbits}
          selectedId={selectedId}
          onPlanetClick={onPlanetClick}
        />

        <EffectComposer multisampling={0}>
          <Bloom
            luminanceThreshold={0.6}
            luminanceSmoothing={0.4}
            intensity={bloomIntensity}
            radius={0.8}
          />
        </EffectComposer>

        <Preload all />
      </Suspense>

      <OrbitControls
        enablePan={false}
        minDistance={10}
        maxDistance={90}
        maxPolarAngle={Math.PI * 0.75}
        autoRotate={autoRotate}
        autoRotateSpeed={autoRotateSpeed}
        dampingFactor={0.08}
        enableDamping
      />
    </Canvas>
    </>
  );
}
