import { useEffect, useRef } from "react";

export function PlanetInfo({ planet, onClose }) {
  const cardRef = useRef();

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
    }
  }, [planet]);

  if (!planet) return null;

  const typeColor = {
    Terrestrial: "#4fa3e0",
    "Gas Giant": "#c88b3a",
    "Ice Giant": "#7de8e8",
  }[planet.type] ?? "#ffffff";

  return (
    <div ref={cardRef} className="planet-card">
      <button className="planet-card__close" onClick={onClose} aria-label="Close">
        ✕
      </button>

      <div className="planet-card__header">
        <span className="planet-card__emoji">{planet.emoji}</span>
        <div>
          <h2 className="planet-card__name">{planet.name}</h2>
          <span
            className="planet-card__badge"
            style={{ borderColor: typeColor, color: typeColor }}
          >
            {planet.type}
          </span>
        </div>
      </div>

      <div className="planet-card__stats">
        <div className="planet-card__stat">
          <span className="planet-card__stat-label">Moons</span>
          <span className="planet-card__stat-value">{planet.moons}</span>
        </div>
        <div className="planet-card__stat">
          <span className="planet-card__stat-label">Orbit Speed</span>
          <span className="planet-card__stat-value">{planet.speed.toFixed(3)}×</span>
        </div>
        <div className="planet-card__stat">
          <span className="planet-card__stat-label">Metalness</span>
          <span className="planet-card__stat-value">{(planet.metalness * 100).toFixed(0)}%</span>
        </div>
      </div>

      <p className="planet-card__fact">💡 {planet.fact}</p>
    </div>
  );
}
