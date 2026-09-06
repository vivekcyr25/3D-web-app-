import { useEffect, useRef } from "react";

export function PlanetInfo({ planet, onClose }) {
  const cardRef = useRef();
  const closeBtnRef = useRef();

  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.style.opacity = "0";
      cardRef.current.style.transform = "translateY(20px) scale(0.96)";
      requestAnimationFrame(() => {
        cardRef.current.style.transition =
          "opacity 0.35s ease, transform 0.35s ease";
        cardRef.current.style.opacity = "1";
        cardRef.current.style.transform = "translateY(0) scale(1)";
      });
      closeBtnRef.current?.focus();
    }
  }, [planet]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!planet) return null;

  const typeColor = {
    Terrestrial: "#4fa3e0",
    "Gas Giant": "#c88b3a",
    "Ice Giant": "#7de8e8",
  }[planet.type] ?? "#ffffff";

  return (
    <div
      ref={cardRef}
      className="planet-card"
      role="dialog"
      aria-modal="false"
      aria-labelledby="planet-card-title"
      aria-describedby="planet-card-fact"
    >
      <button
        ref={closeBtnRef}
        type="button"
        className="planet-card__close"
        onClick={onClose}
        aria-label={`Close ${planet.name} details dialog`}
      >
        <span aria-hidden="true">✕</span>
      </button>

      <div className="planet-card__header">
        <span className="planet-card__emoji" aria-hidden="true">{planet.emoji}</span>
        <div>
          <h2 id="planet-card-title" className="planet-card__name">{planet.name}</h2>
          <span
            className="planet-card__badge"
            style={{ borderColor: typeColor, color: typeColor }}
          >
            {planet.type}
          </span>
        </div>
      </div>

      <div className="planet-card__stats" role="list" aria-label="Physical properties">
        <div className="planet-card__stat" role="listitem">
          <span className="planet-card__stat-label">Moons</span>
          <span className="planet-card__stat-value">{planet.moons}</span>
        </div>
        <div className="planet-card__stat" role="listitem">
          <span className="planet-card__stat-label">Orbit Speed</span>
          <span className="planet-card__stat-value">{planet.speed.toFixed(3)}×</span>
        </div>
        <div className="planet-card__stat" role="listitem">
          <span className="planet-card__stat-label">Metalness</span>
          <span className="planet-card__stat-value">{(planet.metalness * 100).toFixed(0)}%</span>
        </div>
      </div>

      <p id="planet-card-fact" className="planet-card__fact">💡 {planet.fact}</p>
    </div>
  );
}
