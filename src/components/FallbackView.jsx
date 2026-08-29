export function FallbackView() {
  return (
    <div className="fallback">
      <svg
        viewBox="0 0 800 500"
        xmlns="http://www.w3.org/2000/svg"
        className="fallback__svg"
        aria-label="Solar System illustration"
        role="img"
      >
        {/* Background */}
        <rect width="800" height="500" fill="#05071a" />

        {/* Stars */}
        {Array.from({ length: 80 }).map((_, i) => {
          const x = ((i * 97 + 13) % 800);
          const y = ((i * 53 + 7) % 500);
          const r = (i % 3 === 0) ? 1.5 : 1;
          return (
            <circle key={i} cx={x} cy={y} r={r} fill="white" opacity={0.4 + (i % 5) * 0.1} />
          );
        })}

        {/* Orbital rings */}
        {[70, 100, 135, 170, 230, 290, 345, 395].map((r, i) => (
          <ellipse key={i} cx="400" cy="250" rx={r} ry={r * 0.28} fill="none" stroke="white" strokeOpacity="0.1" strokeWidth="1" />
        ))}

        {/* Sun */}
        <circle cx="400" cy="250" r="32" fill="#FDB813" />
        <circle cx="400" cy="250" r="40" fill="#FF8C00" opacity="0.3" />

        {/* Planets */}
        <circle cx="470" cy="250" r="5" fill="#b5b5b5" /> {/* Mercury */}
        <circle cx="500" cy="222" r="8" fill="#e8cda0" /> {/* Venus */}
        <circle cx="535" cy="250" r="9" fill="#4fa3e0" /> {/* Earth */}
        <circle cx="570" cy="279" r="6" fill="#c1440e" /> {/* Mars */}
        <circle cx="630" cy="250" r="18" fill="#c88b3a" /> {/* Jupiter */}
        <circle cx="690" cy="228" r="15" fill="#e4d191" /> {/* Saturn */}
        <ellipse cx="690" cy="228" rx="24" ry="5" fill="none" stroke="#e4d191" strokeWidth="4" opacity="0.6" />
        <circle cx="745" cy="250" r="12" fill="#7de8e8" /> {/* Uranus */}
        <circle cx="793" cy="268" r="11" fill="#3f54ba" /> {/* Neptune */}

        {/* Labels */}
        {[
          [470, 240, "Mercury"], [500, 210, "Venus"], [535, 238, "Earth"],
          [570, 267, "Mars"], [630, 230, "Jupiter"], [690, 208, "Saturn"],
          [745, 234, "Uranus"], [793, 252, "Neptune"],
        ].map(([x, y, name], i) => (
          <text key={i} x={x} y={y} textAnchor="middle" fill="white" fontSize="8" opacity="0.7">{name}</text>
        ))}
      </svg>

      <div className="fallback__text">
        <h2>3D Solar System Explorer</h2>
        <p>Enable animations or use a more powerful device to experience the interactive 3D version.</p>
      </div>
    </div>
  );
}
