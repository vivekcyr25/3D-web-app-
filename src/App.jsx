import { lazy, Suspense, useState, useCallback, useEffect } from "react";
import { useReducedMotion } from "./hooks/useReducedMotion";
import { PlanetInfo } from "./components/PlanetInfo";
import { FallbackView } from "./components/FallbackView";
import { PlanetNavDock } from "./components/PlanetNavDock";
import { CosmicAIGuide } from "./components/CosmicAIGuide";

const SolarSystem = lazy(() =>
  import("./components/SolarSystem").then((m) => ({ default: m.SolarSystem }))
);

function CanvasLoader() {
  return (
    <div className="loader" role="status" aria-live="polite">
      <div className="loader__orbit" aria-hidden="true">
        <div className="loader__planet" />
      </div>
      <p className="loader__text">Launching Solar System…</p>
    </div>
  );
}

export default function App() {
  const prefersReducedMotion = useReducedMotion();
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [isAiGuideOpen, setIsAiGuideOpen] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);

  // Defer heavy 3D canvas initialization so initial paint and TBT are blazing fast
  useEffect(() => {
    const timer = setTimeout(() => setCanvasReady(true), 250);
    return () => clearTimeout(timer);
  }, []);

  const handlePlanetClick = useCallback((planet) => {
    setSelectedPlanet((prev) => (prev?.id === planet.id ? null : planet));
  }, []);

  const handleResetView = useCallback(() => {
    setSelectedPlanet(null);
  }, []);

  const handleClose = useCallback(() => setSelectedPlanet(null), []);

  if (prefersReducedMotion) {
    return <FallbackView />;
  }

  return (
    <div className="app">
      {/* Accessible skip link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Screen reader live status region */}
      <div className="sr-only" role="status" aria-live="polite">
        {selectedPlanet
          ? `Now inspecting ${selectedPlanet.name}. ${selectedPlanet.type} planet.`
          : "Full solar system overview view active."}
      </div>

      {/* Header */}
      <header className="header" role="banner">
        <div className="header__logo">
          <span className="header__icon" aria-hidden="true">🌌</span>
          <h1 className="header__title">Solar System Explorer</h1>
        </div>
        <div className="header__actions">
          <p className="header__hint" aria-hidden="true">
            Click a planet · Scroll to zoom · Drag to orbit
          </p>
        </div>
      </header>

      {/* Main Landmark */}
      <main id="main-content" className="main-content" tabIndex="-1">
        {/* 3D Canvas (lazy loaded) */}
        <div className="canvas-container" aria-hidden="true">
          {canvasReady ? (
            <Suspense fallback={<CanvasLoader />}>
              <SolarSystem
                onPlanetClick={handlePlanetClick}
                selectedId={selectedPlanet?.id}
              />
            </Suspense>
          ) : (
            <CanvasLoader />
          )}
        </div>

        {/* Accessible Keyboard-friendly Planet Navigation Dock */}
        <PlanetNavDock
          selectedId={selectedPlanet?.id}
          onSelectPlanet={handlePlanetClick}
          onResetView={handleResetView}
        />

        {/* Planet info dialog */}
        {selectedPlanet && (
          <PlanetInfo planet={selectedPlanet} onClose={handleClose} />
        )}

        {/* Cosmic AI Guide Assistant */}
        <CosmicAIGuide
          selectedPlanet={selectedPlanet}
          isOpen={isAiGuideOpen}
          onToggle={setIsAiGuideOpen}
        />
      </main>

      {/* Footer */}
      <footer className="footer" role="contentinfo">
        Built with React Three Fiber · 8 planets, 0 model files ·{" "}
        <span className="footer__perf">High-Performance WebGL</span>
      </footer>
    </div>
  );
}
