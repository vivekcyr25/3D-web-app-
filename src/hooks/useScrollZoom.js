import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

/**
 * Hook that maps wheel scroll to camera dolly (zoom).
 * Works alongside OrbitControls — we adjust the camera's Z position
 * before OrbitControls processes events.
 */
export function useScrollZoom({ min = 8, max = 80, speed = 0.05 } = {}) {
  const { camera } = useThree();

  useEffect(() => {
    const onWheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY * speed;
      const newZ = Math.min(max, Math.max(min, camera.position.length() + delta));
      camera.position.setLength(newZ);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [camera, min, max, speed]);
}
