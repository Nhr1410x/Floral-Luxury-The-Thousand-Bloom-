import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PALETTE } from '../constants/colors';

/**
 * Điều khiển hệ thống chiếu sáng thông minh:
 * - Chuyển đổi mượt mà giữa Reception Mode & Ceremony Mode
 * - Spotlights đánh trực diện sân khấu và dọc thảm lối đi
 * - Directional & Ambient fill lights
 */
export default function LightingController({ lightMode = 'ceremony' }) {
  const stageSpotRef1 = useRef();
  const stageSpotRef2 = useRef();
  const aisleSpotRef = useRef();

  // Lerp intensity khi đổi mode
  useFrame((state, delta) => {
    const isCeremony = lightMode === 'ceremony';
    const targetAisleIntensity = isCeremony ? 4.5 : 1.8;
    const targetStageIntensity = isCeremony ? 5.5 : 2.5;

    if (stageSpotRef1.current) {
      stageSpotRef1.current.intensity = THREE.MathUtils.lerp(
        stageSpotRef1.current.intensity,
        targetStageIntensity,
        delta * 3
      );
    }
    if (stageSpotRef2.current) {
      stageSpotRef2.current.intensity = THREE.MathUtils.lerp(
        stageSpotRef2.current.intensity,
        targetStageIntensity,
        delta * 3
      );
    }
    if (aisleSpotRef.current) {
      aisleSpotRef.current.intensity = THREE.MathUtils.lerp(
        aisleSpotRef.current.intensity,
        targetAisleIntensity,
        delta * 3
      );
    }
  });

  const isCeremony = lightMode === 'ceremony';

  return (
    <group name="LightingSystem">
      {/* 1. ÁNH SÁNG MÔI TRƯỜNG (AMBIENT LIGHT) */}
      <ambientLight
        color={PALETTE.ambientWhite}
        intensity={isCeremony ? 0.35 : 0.85}
      />

      {/* 2. ÁNH SÁNG TỔNG THỂ HƯỚNG TỪ TRẦN (DIRECTIONAL LIGHT) */}
      <directionalLight
        position={[5, 12, 10]}
        color={PALETTE.candleWarm}
        intensity={isCeremony ? 0.5 : 1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={45}
        shadow-camera-left={-18}
        shadow-camera-right={18}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
        shadow-bias={-0.0005}
      />

      {/* 3. SPOTLIGHT CHÍNH TẬP TRUNG VÀO SÂN KHẤU (BẮC Z = -15.5m) */}
      <spotLight
        ref={stageSpotRef1}
        position={[-6, 7.8, -6]}
        target-position={[0, 1.8, -15.5]}
        color={PALETTE.candleWarm}
        intensity={4.5}
        angle={Math.PI / 5.5}
        penumbra={0.65}
        distance={22}
        castShadow
      />

      <spotLight
        ref={stageSpotRef2}
        position={[6, 7.8, -6]}
        target-position={[0, 1.8, -15.5]}
        color={PALETTE.candleWarm}
        intensity={4.5}
        angle={Math.PI / 5.5}
        penumbra={0.65}
        distance={22}
        castShadow
      />

      {/* 4. SPOTLIGHT CHIẾU DỌC THẢM LỐI ĐI CHÍNH (CENTER AISLE) */}
      <spotLight
        ref={aisleSpotRef}
        position={[0, 7.8, 6]}
        target-position={[0, 0, 0]}
        color={PALETTE.candleWarm}
        intensity={3.5}
        angle={Math.PI / 3.8}
        penumbra={0.8}
        distance={25}
        castShadow
      />

      {/* Đèn Spot rọi từ trên cao xuống bậc tam cấp mũi bán nguyệt */}
      <spotLight
        position={[0, 7.8, -9]}
        target-position={[0, 0.7, -11.2]}
        color={PALETTE.ambientWhite}
        intensity={isCeremony ? 3.0 : 1.5}
        angle={Math.PI / 6}
        penumbra={0.7}
        distance={15}
      />
    </group>
  );
}

