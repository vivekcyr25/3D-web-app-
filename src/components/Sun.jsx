import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export function Sun() {
  const meshRef = useRef();
  const glowRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.05;
    }
    if (glowRef.current) {
      glowRef.current.material.opacity = 0.15 + Math.sin(t * 1.5) * 0.05;
    }
  });

  return (
    <group>
      {/* Core sun sphere */}
      <mesh ref={meshRef} castShadow={false}>
        <sphereGeometry args={[2.2, 64, 64]} />
        <meshStandardMaterial
          color="#FDB813"
          emissive="#FFA500"
          emissiveIntensity={2.5}
          roughness={1}
          metalness={0}
        />
      </mesh>

      {/* Corona glow layers */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[2.6, 32, 32]} />
        <meshBasicMaterial
          color="#FF6A00"
          transparent
          opacity={0.15}
          depthWrite={false}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[3.0, 32, 32]} />
        <meshBasicMaterial
          color="#FF4500"
          transparent
          opacity={0.06}
          depthWrite={false}
        />
      </mesh>

      {/* Point light emanating from sun */}
      <pointLight color="#FFF4E0" intensity={8} distance={200} decay={1.5} />
      <pointLight color="#FF8C00" intensity={2} distance={50} decay={2} />
    </group>
  );
}
