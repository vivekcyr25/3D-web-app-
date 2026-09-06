import { useRef, useCallback, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getPlanetTexture } from "../utils/planetTextures";

/* ─── Atmosphere glow (fresnel-like via BackSide) ─────────── */
function Atmosphere({ radius, color }) {
  return (
    <mesh>
      <sphereGeometry args={[radius * 1.08, 32, 32]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.22}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ─── Earth's Moon ─────────────────────────────────────────── */
function Moon({ parentRadius }) {
  const pivotRef = useRef();

  useFrame((_, delta) => {
    if (pivotRef.current) pivotRef.current.rotation.y += delta * 1.8;
  });

  return (
    <group ref={pivotRef}>
      <mesh position={[parentRadius + 1.1, 0.15, 0]} castShadow>
        <sphereGeometry args={[0.18, 24, 24]} />
        <meshStandardMaterial
          map={getPlanetTexture("mercury")} /* reuse grey texture */
          roughness={0.95}
          metalness={0.0}
        />
      </mesh>
    </group>
  );
}

/* ─── Saturn's ring system ─────────────────────────────────── */
function SaturnRings() {
  const rings = useMemo(() => {
    return [
      { inner: 1.55, outer: 1.78, opacity: 0.65, color: "#e4d09a" },
      { inner: 1.82, outer: 2.05, opacity: 0.50, color: "#d4c080" },
      { inner: 2.10, outer: 2.28, opacity: 0.32, color: "#c8b468" },
    ].map(({ inner, outer, opacity, color }) => {
      const geo = new THREE.RingGeometry(inner, outer, 128);
      // Remap UVs so the texture spans radially
      const pos = geo.attributes.position;
      const uv = geo.attributes.uv;
      const v3 = new THREE.Vector3();
      for (let i = 0; i < pos.count; i++) {
        v3.fromBufferAttribute(pos, i);
        const len = v3.length();
        uv.setXY(i, (len - inner) / (outer - inner), 1);
      }
      const mat = new THREE.MeshBasicMaterial({
        color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity,
        depthWrite: false,
      });
      return { geo, mat };
    });
  }, []);

  return (
    <group rotation={[Math.PI * 0.40, 0.08, 0]}>
      {rings.map(({ geo, mat }, i) => (
        <mesh key={i} geometry={geo} material={mat} />
      ))}
    </group>
  );
}

/* ─── Selection pulse ring ─────────────────────────────────── */
function SelectionRing({ radius }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const s = 1 + Math.sin(clock.getElapsedTime() * 3) * 0.06;
    ref.current.scale.setScalar(s);
    ref.current.material.opacity = 0.2 + Math.sin(clock.getElapsedTime() * 3) * 0.08;
  });
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius + 0.2, radius + 0.45, 64]} />
      <meshBasicMaterial
        color="#ffffff"
        transparent
        opacity={0.22}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ─── Planet atmosphere configs ───────────────────────────── */
const ATMOSPHERE = {
  earth: "#4fa3e0",
  venus: "#e8c88a",
  mars: "#c04020",
  uranus: "#7de8e8",
  neptune: "#3f54ba",
  jupiter: "#c89040",
  saturn: "#e8d890",
};

/* ─── Main Planet component ────────────────────────────────── */
export function Planet({ data, timeScale = 1, showOrbits, onClick, isSelected }) {
  const pivotRef = useRef();
  const meshRef = useRef();
  const angleRef = useRef((data.distance * 1.61803398875) % (Math.PI * 2));

  const texture = useMemo(() => getPlanetTexture(data.id), [data.id]);

  useFrame((_, delta) => {
    angleRef.current += data.speed * timeScale * delta * 0.3;
    if (pivotRef.current) {
      pivotRef.current.position.x = Math.cos(angleRef.current) * data.distance;
      pivotRef.current.position.z = Math.sin(angleRef.current) * data.distance;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.35;
    }
  });

  const handleClick = useCallback(
    (e) => { e.stopPropagation(); onClick(data); },
    [data, onClick]
  );

  const atmosphereColor = ATMOSPHERE[data.id];

  return (
    <>
      {/* Orbital ring */}
      {showOrbits && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[data.distance - 0.04, data.distance + 0.04, 128]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.07}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Planet at orbital position */}
      <group ref={pivotRef}>
        {/* Main sphere */}
        <mesh
          ref={meshRef}
          onClick={handleClick}
          onPointerOver={() => (document.body.style.cursor = "pointer")}
          onPointerOut={() => (document.body.style.cursor = "auto")}
        >
          <sphereGeometry args={[data.radius, 64, 64]} />
          <meshStandardMaterial
            map={texture}
            roughness={data.roughness}
            metalness={data.metalness}
          />
        </mesh>

        {/* Atmosphere halo */}
        {atmosphereColor && (
          <Atmosphere radius={data.radius} color={atmosphereColor} />
        )}

        {/* Saturn rings */}
        {data.hasRings && <SaturnRings />}

        {/* Earth moon */}
        {data.hasMoon && <Moon parentRadius={data.radius} />}

        {/* Selection animated ring */}
        {isSelected && <SelectionRing radius={data.radius} />}
      </group>
    </>
  );
}
