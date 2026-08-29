import { lazy, Suspense, useState, useCallback } from "react";
import { useReducedMotion } from "./hooks/useReducedMotion";
import { PlanetInfo } from "./components/PlanetInfo";
import { FallbackView } from "./components/FallbackView";

const SolarSystem = lazy(() =>
  import("./components/SolarSystem").then((m) => ({ default: m.SolarSystem }))
);

function CanvasLoader() {
  return (
    <div className="loader">
      <div className="loader__orbit">
        <div className="loader__planet" />
      </div>
      <p className="loader__text">Launching Solar System…</p>
    </div>
  );
}

export default function App() {
  const prefersReducedMotion = useReducedMotion();
  const [selectedPlanet, setSelectedPlanet] = useState(null);

  const handlePlanetClick = useCallback((planet) => {
    setSelectedPlanet((prev) => (prev?.id === planet.id ? null : planet));
  }, []);

  const handleClose = useCallback(() => setSelectedPlanet(null), []);

  if (prefersReducedMotion) {
    return <FallbackView />;
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header__logo">
          <span className="header__icon">🌌</span>
          <span className="header__title">Solar System Explorer</span>
        </div>
        <p className="header__hint">
          Click a planet · Scroll to zoom · Drag to orbit
        </p>
      </header>

      {/* 3D Canvas (lazy loaded) */}
      <div className="canvas-container">
        <Suspense fallback={<CanvasLoader />}>
          <SolarSystem
            onPlanetClick={handlePlanetClick}
            selectedId={selectedPlanet?.id}
          />
        </Suspense>
      </div>

      {/* Planet info panel */}
      {selectedPlanet && (
        <PlanetInfo planet={selectedPlanet} onClose={handleClose} />
      )}

      {/* Footer */}
      <footer className="footer">
        Built with React Three Fiber · 8 planets, 0 model files ·{" "}
        <span className="footer__perf">~180 KB gzipped</span>
      </footer>
    </div>
  );
}
