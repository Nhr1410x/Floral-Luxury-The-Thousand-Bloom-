import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PALETTE } from '../constants/colors';

/**
 * Điều khiển hệ thống chiếu sáng thông minh (Tone Sáng Sang Trọng):
 * - Chiếu sáng mạnh mẽ toàn sảnh tiệc, loại bỏ cảm giác u tối
 * - Dàn Stage Keylights & Followspots cực mạnh rọi trực diện vào sân khấu và vòm hoa
 * - Uplighting chân vòm và viền bán nguyệt sân khấu rực rỡ
 */
export default function LightingController({ lightMode = 'ceremony' }) {
  const stageSpotRef1 = useRef();
  const stageSpotRef2 = useRef();
  const stageCenterSpotRef = useRef();
  const aisleSpotRef = useRef();
  const ambientLightRef = useRef();
  const dirLightRef = useRef();

  useFrame((state, delta) => {
    const isCeremony = lightMode === 'ceremony';
    // Đảm bảo cả hai chế độ đều tươi sáng, trong đó Ceremony Mode tập trung rực rỡ vào sân khấu
    const targetStageIntensity = isCeremony ? 9.5 : 7.0;
    const targetCenterIntensity = isCeremony ? 10.0 : 7.5;
    const targetAisleIntensity = isCeremony ? 6.5 : 4.5;
    const targetAmbient = isCeremony ? 1.4 : 1.9;
    const targetDir = isCeremony ? 2.5 : 3.2;

    const s = delta * 3.5;
    if (stageSpotRef1.current) stageSpotRef1.current.intensity = THREE.MathUtils.lerp(stageSpotRef1.current.intensity, targetStageIntensity, s);
    if (stageSpotRef2.current) stageSpotRef2.current.intensity = THREE.MathUtils.lerp(stageSpotRef2.current.intensity, targetStageIntensity, s);
    if (stageCenterSpotRef.current) stageCenterSpotRef.current.intensity = THREE.MathUtils.lerp(stageCenterSpotRef.current.intensity, targetCenterIntensity, s);
    if (aisleSpotRef.current) aisleSpotRef.current.intensity = THREE.MathUtils.lerp(aisleSpotRef.current.intensity, targetAisleIntensity, s);
    if (ambientLightRef.current) ambientLightRef.current.intensity = THREE.MathUtils.lerp(ambientLightRef.current.intensity, targetAmbient, s);
    if (dirLightRef.current) dirLightRef.current.intensity = THREE.MathUtils.lerp(dirLightRef.current.intensity, targetDir, s);
  });

  return (
    <group name="LightingSystem">
      {/* 1. ÁNH SÁNG MÔI TRƯỜNG TƯƠI SÁNG (HIGH AMBIENT LIGHT) */}
      <ambientLight
        ref={ambientLightRef}
        color="#FFFBF5"
        intensity={1.6}
      />

      {/* 2. ÁNH SÁNG TỔNG THỂ HƯỚNG TỪ TRẦN (DIRECTIONAL SUNLIGHT / KEYLIGHT) */}
      <directionalLight
        ref={dirLightRef}
        position={[6, 14, 12]}
        color="#FFF8EE"
        intensity={2.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={28}
        shadow-camera-bottom={-28}
        shadow-bias={-0.0003}
      />

      {/* Đèn Fill Light thứ hai từ hướng ngược lại để loại bỏ góc khuất tối */}
      <directionalLight
        position={[-8, 12, -8]}
        color="#FFF5E8"
        intensity={1.6}
      />

      {/* 3. DÀN SPOTLIGHT CỰC MẠNH RỌI THẲNG VÀO SÂN KHẤU (NORTH STAGE Z = -16m) */}
      {/* Spotlight trung tâm sân khấu rọi vòm hoa & chữ "The Thousand Bloom" */}
      <spotLight
        ref={stageCenterSpotRef}
        position={[0, 7.8, -4]}
        target-position={[0, 3.8, -18.2]}
        color="#FFF2D6"
        intensity={9.0}
        angle={Math.PI / 4}
        penumbra={0.6}
        distance={26}
        castShadow
      />

      {/* Spotlight cánh trái rọi chéo vào sân khấu */}
      <spotLight
        ref={stageSpotRef1}
        position={[-7, 7.8, -5]}
        target-position={[0, 2.0, -15.5]}
        color="#FFE4B5"
        intensity={8.5}
        angle={Math.PI / 4.5}
        penumbra={0.65}
        distance={25}
        castShadow
      />

      {/* Spotlight cánh phải rọi chéo vào sân khấu */}
      <spotLight
        ref={stageSpotRef2}
        position={[7, 7.8, -5]}
        target-position={[0, 2.0, -15.5]}
        color="#FFE4B5"
        intensity={8.5}
        angle={Math.PI / 4.5}
        penumbra={0.65}
        distance={25}
        castShadow
      />

      {/* Đèn Followspot chiếu thẳng mũi bán nguyệt & bậc tam cấp */}
      <spotLight
        position={[0, 7.8, -6]}
        target-position={[0, 0.75, -11.5]}
        color="#FFFFFF"
        intensity={7.0}
        angle={Math.PI / 5}
        penumbra={0.5}
        distance={20}
        castShadow
      />

      {/* 4. SPOTLIGHT CHIẾU DỌC THẢM LỐI ĐI CHÍNH (CENTER AISLE) */}
      <spotLight
        ref={aisleSpotRef}
        position={[0, 7.8, 6]}
        target-position={[0, 0, 2]}
        color="#FFF5E6"
        intensity={5.5}
        angle={Math.PI / 3.2}
        penumbra={0.7}
        distance={26}
      />
    </group>
  );
}
