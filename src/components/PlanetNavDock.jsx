import { memo } from "react";
import { PLANETS } from "../data/planets";

export const PlanetNavDock = memo(function PlanetNavDock({
  selectedId,
  onSelectPlanet,
  onResetView,
}) {
  return (
    <nav
      className="planet-dock"
      aria-label="Planetary Exploration Navigation"
      role="navigation"
    >
      <div className="planet-dock__scroller" role="toolbar" aria-label="Select celestial body to inspect">
        <button
          type="button"
          className={`planet-dock__btn ${!selectedId ? "is-active" : ""}`}
          onClick={onResetView}
          aria-pressed={!selectedId}
          aria-label="Overview mode: Full solar system view"
        >
          <span className="planet-dock__icon" aria-hidden="true">☀️</span>
          <span className="planet-dock__label">Overview</span>
        </button>

        <div className="planet-dock__divider" aria-hidden="true" />

        {PLANETS.map((planet) => {
          const isSelected = selectedId === planet.id;
          return (
            <button
              key={planet.id}
              type="button"
              className={`planet-dock__btn ${isSelected ? "is-active" : ""}`}
              onClick={() => onSelectPlanet(planet)}
              aria-pressed={isSelected}
              aria-label={`Inspect ${planet.name}, ${planet.type} planet with ${planet.moons} moons`}
            >
              <span className="planet-dock__icon" aria-hidden="true">
                {planet.emoji}
              </span>
              <span className="planet-dock__label">{planet.name}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
});
