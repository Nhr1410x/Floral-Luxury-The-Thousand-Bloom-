import React, { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { CAMERA_PRESETS } from '../constants/cameraPresets';

/**
 * Quản lý Camera & Chuyển đổi góc nhìn mượt mà:
 * - 4 Presets: Overview, Center Aisle, Table Close-up, Reception Area
 * - Chế độ Cinematic Drone Tour (Tour quay flycam tự động qua toàn bộ sảnh tiệc)
 * - Tự động zoom đến bàn tiệc khi người dùng chọn
 * - Hỗ trợ tương tác chuột / cảm ứng mượt mà không bị khóa camera
 */
export default function CameraManager({
  activePresetId,
  selectedTable,
  isAutoRotate = false,
  isCinematicTour = false,
  onTourEnd
}) {
  const { camera } = useThree();
  const controlsRef = useRef();

  // Target vectors for animation
  const desiredPos = useRef(new THREE.Vector3(...CAMERA_PRESETS[0].position));
  const desiredTarget = useRef(new THREE.Vector3(...CAMERA_PRESETS[0].target));
  const isTransitioning = useRef(false);

  // Cinematic Tour State
  const tourProgress = useRef(0);
  const tourWaypoints = [
    { pos: [0, 2.2, 28.0], target: [0, 1.5, 23.5] },     // 1. Tiền sảnh & Reception
    { pos: [0, 1.7, 19.0], target: [0, 2.0, -15.5] },    // 2. Bước qua cửa chính
    { pos: [0, 1.6, 5.0], target: [0, 2.1, -15.5] },     // 3. Lướt giữa lối đi thảm kem
    { pos: [0, 2.8, -9.0], target: [0, 3.8, -18.2] },    // 4. Ngước nhìn vòm hoa & chữ vàng
    { pos: [-3.8, 1.6, -9.5], target: [-5.0, 1.1, -11.2] }, // 5. Cận cảnh bàn VIP
    { pos: [0, 27, 26], target: [0, 1.5, -2] }            // 6. Bay lên toàn cảnh
  ];

  // Lắng nghe tương tác người dùng: Ngắt transition ngay khi người dùng kéo chuột
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const handleUserInteractionStart = () => {
      // Khi người dùng bấm/kéo chuột, lập tức hủy hiệu ứng lerp tự động để người dùng tự do điều khiển
      isTransitioning.current = false;
    };

    controls.addEventListener('start', handleUserInteractionStart);
    return () => {
      controls.removeEventListener('start', handleUserInteractionStart);
    };
  }, []);

  // Khi activePresetId thay đổi từ UI
  useEffect(() => {
    if (isCinematicTour) return;
    const preset = CAMERA_PRESETS.find((p) => p.id === activePresetId);
    if (preset) {
      desiredPos.current.set(...preset.position);
      desiredTarget.current.set(...preset.target);
      isTransitioning.current = true;
    }
  }, [activePresetId, isCinematicTour]);

  // Khi người dùng click chọn 1 bàn cụ thể
  useEffect(() => {
    if (isCinematicTour) return;
    if (selectedTable) {
      desiredPos.current.set(
        selectedTable.x + 2.0,
        1.55,
        selectedTable.z + 2.0
      );
      desiredTarget.current.set(
        selectedTable.x,
        0.85,
        selectedTable.z
      );
      isTransitioning.current = true;
    }
  }, [selectedTable, isCinematicTour]);

  // Reset tour progress khi bật tour
  useEffect(() => {
    if (isCinematicTour) {
      tourProgress.current = 0;
      isTransitioning.current = false;
    }
  }, [isCinematicTour]);

  // Frame update loop
  useFrame((state, delta) => {
    const controls = controlsRef.current;
    if (!controls) return;

    // 1. Chế độ Cinematic Tour
    if (isCinematicTour) {
      tourProgress.current += delta * 0.14;
      const totalStages = tourWaypoints.length - 1;
      const currentStage = Math.min(Math.floor(tourProgress.current), totalStages - 1);
      const stageT = tourProgress.current - currentStage;

      if (tourProgress.current >= totalStages) {
        if (onTourEnd) onTourEnd();
        return;
      }

      const p0 = tourWaypoints[currentStage];
      const p1 = tourWaypoints[currentStage + 1];
      const smoothT = THREE.MathUtils.smoothstep(stageT, 0, 1);

      desiredPos.current.lerpVectors(
        new THREE.Vector3(...p0.pos),
        new THREE.Vector3(...p1.pos),
        smoothT
      );
      desiredTarget.current.lerpVectors(
        new THREE.Vector3(...p0.target),
        new THREE.Vector3(...p1.target),
        smoothT
      );

      camera.position.copy(desiredPos.current);
      controls.target.copy(desiredTarget.current);
      controls.update();
      return;
    }

    // 2. Chế độ chuyển góc nhìn lerp mượt mà
    if (isTransitioning.current) {
      const speed = Math.min(delta * 4.5, 0.2);
      camera.position.lerp(desiredPos.current, speed);
      controls.target.lerp(desiredTarget.current, speed);

      // Khi đã đến đủ gần đích thì kết thúc chuyển động
      if (
        camera.position.distanceTo(desiredPos.current) < 0.12 &&
        controls.target.distanceTo(desiredTarget.current) < 0.12
      ) {
        camera.position.copy(desiredPos.current);
        controls.target.copy(desiredTarget.current);
        isTransitioning.current = false;
      }
    }

    // 3. QUAN TRỌNG: LUÔN GỌI controls.update() MỖI FRAME ĐỂ ORBITCONTROLS HOẠT ĐỘNG
    controls.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping={true}
      dampingFactor={0.08}
      maxPolarAngle={Math.PI / 2 - 0.04} // Không cho camera chìm xuống dưới sàn nhà
      minDistance={0.8}
      maxDistance={65}
      rotateSpeed={0.8}
      zoomSpeed={1.0}
      panSpeed={0.8}
      autoRotate={isAutoRotate && !isCinematicTour}
      autoRotateSpeed={0.6}
      makeDefault
    />
  );
}
