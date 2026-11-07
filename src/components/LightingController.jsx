import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PALETTE } from '../constants/colors';

/**
 * Điều khiển hệ thống chiếu sáng (Sáng Nổi Bật - Focal Contrast & Brilliance):
 * - Không gian nền dịu ấm, tôn vinh chiều sâu kiến trúc
 * - Sân khấu chính, vòm hoa và thảm lối đi được đánh đèn SPOTLIGHT CỰC KỲ NỔI BẬT
 * - Chuyển đổi linh hoạt giữa Ceremony Mode (tập trung sân khấu) và Reception Mode (sáng rõ đều)
 */
export default function LightingController({ lightMode = 'ceremony' }) {
  const stageSpotRef1 = useRef();
  const stageSpotRef2 = useRef();
  const stageCenterSpotRef = useRef();
  const stageFollowSpotRef = useRef();
  const aisleSpotRef = useRef();
  const ambientLightRef = useRef();
  const dirLightRef = useRef();

  useFrame((state, delta) => {
    const isCeremony = lightMode === 'ceremony';
    // Cân chỉnh vừa vặn: Sân khấu sáng nổi bật, không bị chói lóa
    const targetStageIntensity = isCeremony ? 6.5 : 4.5;
    const targetCenterIntensity = isCeremony ? 7.5 : 5.0;
    const targetFollowIntensity = isCeremony ? 5.5 : 3.5;
    const targetAisleIntensity = isCeremony ? 5.0 : 3.5;
    const targetAmbient = isCeremony ? 0.45 : 0.85;
    const targetDir = isCeremony ? 0.9 : 1.5;

    const s = delta * 3.5;
    if (stageSpotRef1.current) stageSpotRef1.current.intensity = THREE.MathUtils.lerp(stageSpotRef1.current.intensity, targetStageIntensity, s);
    if (stageSpotRef2.current) stageSpotRef2.current.intensity = THREE.MathUtils.lerp(stageSpotRef2.current.intensity, targetStageIntensity, s);
    if (stageCenterSpotRef.current) stageCenterSpotRef.current.intensity = THREE.MathUtils.lerp(stageCenterSpotRef.current.intensity, targetCenterIntensity, s);
    if (stageFollowSpotRef.current) stageFollowSpotRef.current.intensity = THREE.MathUtils.lerp(stageFollowSpotRef.current.intensity, targetFollowIntensity, s);
    if (aisleSpotRef.current) aisleSpotRef.current.intensity = THREE.MathUtils.lerp(aisleSpotRef.current.intensity, targetAisleIntensity, s);
    if (ambientLightRef.current) ambientLightRef.current.intensity = THREE.MathUtils.lerp(ambientLightRef.current.intensity, targetAmbient, s);
    if (dirLightRef.current) dirLightRef.current.intensity = THREE.MathUtils.lerp(dirLightRef.current.intensity, targetDir, s);
  });

  return (
    <group name="LightingSystem">
      {/* 1. ÁNH SÁNG MÔI TRƯỜNG DỊU ẤM (BALANCED AMBIENT LIGHT) */}
      <ambientLight
        ref={ambientLightRef}
        color="#FFF6ED"
        intensity={0.5}
      />

      {/* 2. ÁNH SÁNG HƯỚNG TỪ TRẦN (WARM DIRECTIONAL KEYLIGHT) */}
      <directionalLight
        ref={dirLightRef}
        position={[6, 14, 10]}
        color="#FFF4E6"
        intensity={1.1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={48}
        shadow-camera-left={-18}
        shadow-camera-right={18}
        shadow-camera-top={26}
        shadow-camera-bottom={-26}
        shadow-bias={-0.0004}
      />

      {/* 3. DÀN SPOTLIGHT TẬP TRUNG LÀM SÂN KHẤU SÁNG NỔI BẬT */}
      {/* Spotlight trung tâm rọi trực diện vòm hoa và chữ The Thousand Bloom */}
      <spotLight
        ref={stageCenterSpotRef}
        position={[0, 7.8, -4]}
        target-position={[0, 3.8, -18.2]}
        color="#FFF0D0"
        intensity={7.0}
        angle={Math.PI / 4.2}
        penumbra={0.65}
        distance={24}
        castShadow
      />

      {/* Spotlight cánh trái rọi chéo góc 45 độ */}
      <spotLight
        ref={stageSpotRef1}
        position={[-7, 7.8, -5]}
        target-position={[0, 2.0, -15.5]}
        color="#FFE4B5"
        intensity={6.0}
        angle={Math.PI / 4.5}
        penumbra={0.7}
        distance={23}
        castShadow
      />

      {/* Spotlight cánh phải rọi chéo góc 45 độ */}
      <spotLight
        ref={stageSpotRef2}
        position={[7, 7.8, -5]}
        target-position={[0, 2.0, -15.5]}
        color="#FFE4B5"
        intensity={6.0}
        angle={Math.PI / 4.5}
        penumbra={0.7}
        distance={23}
        castShadow
      />

      {/* Đèn Followspot chiếu mũi bán nguyệt & bậc tam cấp */}
      <spotLight
        ref={stageFollowSpotRef}
        position={[0, 7.8, -7]}
        target-position={[0, 0.75, -11.5]}
        color="#FFF9EE"
        intensity={5.0}
        angle={Math.PI / 4.8}
        penumbra={0.55}
        distance={18}
        castShadow
      />

      {/* 4. SPOTLIGHT CHIẾU DỌC THẢM LỐI ĐI CHÍNH (CENTER AISLE RUNWAY) */}
      <spotLight
        ref={aisleSpotRef}
        position={[0, 7.8, 6]}
        target-position={[0, 0, 2]}
        color="#FFF2DC"
        intensity={4.5}
        angle={Math.PI / 3.4}
        penumbra={0.75}
        distance={24}
        castShadow
      />
    </group>
  );
}
