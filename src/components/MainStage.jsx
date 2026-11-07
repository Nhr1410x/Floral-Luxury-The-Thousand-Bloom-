import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import { PALETTE, PBR_MATERIALS } from '../constants/colors';
import { STAGE_CONFIG } from '../constants/layoutData';

/**
 * Sân khấu chính (Main Stage) phía Bắc:
 * - Khối chữ nhật lùi sau + Mũi sân khấu hình bán nguyệt (semi-circular extension) nhô ra phía trước
 * - Hệ thống HOA DÀY ĐẶC:
 *   + Vòm hoa đa tầng (Multi-tier floral arch) nở rộ phía sau
 *   + Dải hoa viền quanh mép mũi bán nguyệt sân khấu (Curved Floral Rim)
 *   + Cụm hoa hai bên bậc tam cấp chính giữa
 *   + Các trụ hoa lớn (Grand Floral Pedestals) hai bên cánh gà
 * - Hệ thống ĐÈN CHIẾU SÂN KHẤU CỰC MẠNH:
 *   + Dàn đèn hắt chân vòm (Uplighting) công suất cao
 *   + Đèn hào quang (Backlight Halo) chiếu sáng chữ 3D "The Thousand Bloom"
 *   + Đèn chiếu dọc viền hoa bán nguyệt
 */
export default function MainStage({ lightMode = 'ceremony' }) {
  const { rectWidth, rectDepth, rectZ, semiRadius, semiCenterZ, height } = STAGE_CONFIG;

  // 1. Tạo geometry cho phần bán nguyệt nhô ra phía trước
  const semiStageGeom = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-semiRadius, 0);
    shape.absarc(0, 0, semiRadius, Math.PI, 0, true);
    shape.lineTo(semiRadius, 0);
    shape.closePath();

    const extrudeSettings = {
      depth: height,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.05,
      bevelThickness: 0.04
    };

    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.rotateX(Math.PI / 2);
    return geom;
  }, [semiRadius, height]);

  // 2. Hệ hoa đa tầng dày đặc trên khung vòm sân khấu (Floral Arch)
  const floralArchElements = useMemo(() => {
    const items = [];
    const tiers = [
      { radius: 5.0, zOffset: -18.7, count: 65, yStart: 0.8, yEnd: 6.6, spread: 0.45 },
      { radius: 4.4, zOffset: -18.3, count: 55, yStart: 0.8, yEnd: 5.9, spread: 0.4 },
      { radius: 3.7, zOffset: -17.9, count: 48, yStart: 0.8, yEnd: 5.1, spread: 0.35 }
    ];

    const flowerColors = [
      PALETTE.dustyBlue,      // Cẩm tú cầu xanh pastel
      PALETTE.blushPink,      // Hoa hồng phấn
      PALETTE.ivory,          // Hoa hồng trắng ngà
      PALETTE.sageGreen,      // Lá bạc
      PALETTE.dustyBlueLight,
      PALETTE.blushPinkSoft,
      '#FFFFFF'
    ];

    tiers.forEach((tier, tierIdx) => {
      for (let i = 0; i <= tier.count; i++) {
        const theta = (i / tier.count) * Math.PI;
        const x = -Math.cos(theta) * tier.radius + (Math.random() - 0.5) * tier.spread;
        const y = Math.sin(theta) * (tier.yEnd - tier.yStart) + tier.yStart + (Math.random() - 0.5) * tier.spread;
        const z = tier.zOffset + (Math.random() - 0.5) * 0.35;
        const scale = 0.22 + Math.random() * 0.26;
        const color = flowerColors[Math.floor(Math.random() * flowerColors.length)];

        items.push({
          id: `arch-${tierIdx}-${i}`,
          pos: [x, y, z],
          scale,
          color,
          isLeaf: color === PALETTE.sageGreen
        });
      }
    });

    return items;
  }, []);

  // 3. Dải hoa tươi viền quanh mép mũi bán nguyệt sân khấu (Semi-circular Floral Hedge)
  const stageRimFlowers = useMemo(() => {
    const items = [];
    const count = 45;
    const colors = [PALETTE.dustyBlue, PALETTE.blushPink, PALETTE.ivory, PALETTE.sageGreen];

    for (let i = 0; i <= count; i++) {
      const angle = (i / count) * Math.PI; // 0 đến PI
      // Chừa khoảng giữa bậc tam cấp (angle ~ PI/2)
      if (Math.abs(angle - Math.PI / 2) < 0.22) continue;

      const r = semiRadius + 0.05 + (Math.random() - 0.5) * 0.15;
      const x = -Math.cos(angle) * r;
      const z = semiCenterZ + Math.sin(angle) * r;
      const y = height + 0.12 + (Math.random() - 0.5) * 0.08;

      items.push({
        id: `rim-fl-${i}`,
        pos: [x, y, z],
        scale: 0.18 + Math.random() * 0.16,
        color: colors[Math.floor(Math.random() * colors.length)],
        isLeaf: Math.random() > 0.65
      });
    }
    return items;
  }, [semiRadius, semiCenterZ, height]);

  // 4. Hoa hai bên bậc tam cấp chính giữa (Center Steps Floral Cascades)
  const stepFlowers = useMemo(() => {
    const items = [];
    const colors = [PALETTE.blushPink, PALETTE.dustyBlue, PALETTE.ivory, PALETTE.sageGreen];

    [-1.75, 1.75].forEach((sideX, sideIdx) => {
      for (let s = 0; s < 12; s++) {
        const progress = s / 12;
        const z = semiCenterZ + semiRadius + progress * 0.75;
        const y = height * (1 - progress * 0.8) + 0.1;
        const x = sideX + (sideX > 0 ? progress * 0.3 : -progress * 0.3) + (Math.random() - 0.5) * 0.15;

        items.push({
          id: `step-fl-${sideIdx}-${s}`,
          pos: [x, y, z],
          scale: 0.16 + Math.random() * 0.14,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
    });
    return items;
  }, [semiRadius, semiCenterZ, height]);

  return (
    <group name="MainStage">
      {/* 1. KHỐI SÂN KHẤU CHỮ NHẬT LÙI VỀ PHÍA SAU (SƠN TRẮNG SÁNG SANG TRỌNG) */}
      <mesh position={[0, height / 2, rectZ]} receiveShadow castShadow>
        <boxGeometry args={[rectWidth, height, rectDepth]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.25} metalness={0.08} />
      </mesh>

      {/* Viền kim loại Champagne Gold chạy quanh mép khối chữ nhật */}
      <mesh position={[0, height - 0.02, rectZ - rectDepth / 2]}>
        <boxGeometry args={[rectWidth + 0.1, 0.06, 0.1]} />
        <meshStandardMaterial {...PBR_MATERIALS.goldMetal} />
      </mesh>

      {/* 2. MŨI SÂN KHẤU HÌNH BÁN NGUYỆT (SEMI-CIRCULAR EXTENSION) NHÔ RA PHÍA TRƯỚC */}
      <mesh
        geometry={semiStageGeom}
        position={[0, height, semiCenterZ]}
        receiveShadow
        castShadow
      >
        <meshStandardMaterial color="#FFFFFF" roughness={0.25} metalness={0.08} />
      </mesh>

      {/* Viền kim loại mạ vàng cong quanh mũi bán nguyệt */}
      <group position={[0, height - 0.02, semiCenterZ]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[semiRadius - 0.04, semiRadius + 0.04, 64, 1, 0, Math.PI]} />
          <meshStandardMaterial {...PBR_MATERIALS.goldMetal} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* 3. BẬC TAM CẤP Ở CHÍNH GIỮA MŨI BÁN NGUYỆT */}
      <group position={[0, 0, semiCenterZ + semiRadius]}>
        {/* Bậc 1 */}
        <mesh position={[0, 0.12, 0.6]} receiveShadow>
          <boxGeometry args={[3.2, 0.24, 0.5]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.24, 0.85]}>
          <boxGeometry args={[3.22, 0.03, 0.05]} />
          <meshStandardMaterial {...PBR_MATERIALS.goldMetal} />
        </mesh>

        {/* Bậc 2 */}
        <mesh position={[0, 0.36, 0.25]} receiveShadow>
          <boxGeometry args={[3.0, 0.24, 0.45]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.48, 0.48]}>
          <boxGeometry args={[3.02, 0.03, 0.05]} />
          <meshStandardMaterial {...PBR_MATERIALS.goldMetal} />
        </mesh>

        {/* Bậc 3 */}
        <mesh position={[0, 0.6, -0.05]} receiveShadow>
          <boxGeometry args={[2.8, 0.24, 0.4]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.72, 0.15]}>
          <boxGeometry args={[2.82, 0.03, 0.05]} />
          <meshStandardMaterial {...PBR_MATERIALS.goldMetal} />
        </mesh>
      </group>

      {/* Cụm hoa hai bên bậc tam cấp */}
      <group name="StepFlowers">
        {stepFlowers.map((fl) => (
          <mesh key={fl.id} position={fl.pos} scale={fl.scale} castShadow>
            <dodecahedronGeometry args={[0.3, 1]} />
            <meshStandardMaterial color={fl.color} roughness={0.65} />
          </mesh>
        ))}
      </group>

      {/* 4. DẢI HOA TƯƠI VIỀN QUANH MŨI BÁN NGUYỆT SÂN KHẤU */}
      <group name="StageRimFlowers">
        {stageRimFlowers.map((fl) => (
          <mesh key={fl.id} position={fl.pos} scale={fl.scale} castShadow>
            {fl.isLeaf ? (
              <coneGeometry args={[0.16, 0.38, 5]} />
            ) : (
              <dodecahedronGeometry args={[0.28, 1]} />
            )}
            <meshStandardMaterial color={fl.color} roughness={0.65} />
          </mesh>
        ))}
      </group>

      {/* 5. HAI CẦU THANG UỐN NHẸ Ở HAI BÊN CÁNH GÀ (TRÁI / PHẢI) */}
      <group position={[-rectWidth / 2 - 0.3, 0, semiCenterZ - 0.5]} rotation={[0, Math.PI / 4, 0]}>
        {[0, 1, 2].map((stepIdx) => (
          <group key={`left-step-${stepIdx}`} position={[0, (stepIdx + 1) * 0.22, stepIdx * 0.4]}>
            <mesh receiveShadow>
              <boxGeometry args={[1.6, 0.22, 0.45]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.11, 0.22]}>
              <boxGeometry args={[1.62, 0.03, 0.04]} />
              <meshStandardMaterial {...PBR_MATERIALS.goldMetal} />
            </mesh>
          </group>
        ))}
        <mesh position={[-0.75, 1.0, 0.4]} rotation={[Math.PI / 6, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 1.8, 12]} />
          <meshStandardMaterial {...PBR_MATERIALS.goldMetal} />
        </mesh>
      </group>

      <group position={[rectWidth / 2 + 0.3, 0, semiCenterZ - 0.5]} rotation={[0, -Math.PI / 4, 0]}>
        {[0, 1, 2].map((stepIdx) => (
          <group key={`right-step-${stepIdx}`} position={[0, (stepIdx + 1) * 0.22, stepIdx * 0.4]}>
            <mesh receiveShadow>
              <boxGeometry args={[1.6, 0.22, 0.45]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.11, 0.22]}>
              <boxGeometry args={[1.62, 0.03, 0.04]} />
              <meshStandardMaterial {...PBR_MATERIALS.goldMetal} />
            </mesh>
          </group>
        ))}
        <mesh position={[0.75, 1.0, 0.4]} rotation={[Math.PI / 6, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 1.8, 12]} />
          <meshStandardMaterial {...PBR_MATERIALS.goldMetal} />
        </mesh>
      </group>

      {/* 6. CÁC TRỤ HOA LỚN HOÀNG GIA (GRAND FLORAL PEDESTALS) Ở HAI BÊN CÁNH GÀ */}
      {[-6.5, 6.5].map((gx, gIdx) => (
        <group key={`grand-ped-${gIdx}`} position={[gx, height, -16.5]}>
          {/* Đôn hoa kim loại mạ vàng cao 1.1m */}
          <mesh position={[0, 0.55, 0]}>
            <cylinderGeometry args={[0.28, 0.36, 1.1, 16]} />
            <meshStandardMaterial {...PBR_MATERIALS.goldMetal} />
          </mesh>
          {/* Cụm hoa khổng lồ dạng tháp nở rộ */}
          <mesh position={[0, 1.45, 0]} castShadow>
            <sphereGeometry args={[0.68, 16, 16]} />
            <meshStandardMaterial color={PALETTE.dustyBlue} roughness={0.65} />
          </mesh>
          <mesh position={[0.15, 1.8, 0.1]} scale={0.5}>
            <sphereGeometry args={[0.6, 12, 12]} />
            <meshStandardMaterial color={PALETTE.blushPink} roughness={0.65} />
          </mesh>
          <mesh position={[-0.15, 1.75, -0.1]} scale={0.55}>
            <sphereGeometry args={[0.6, 12, 12]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.65} />
          </mesh>
          {/* Đèn spotlight rọi thẳng từ chân trụ hoa */}
          <pointLight position={[0, 2.2, 0]} color={PALETTE.candleWarm} intensity={3.5} distance={5} />
        </group>
      ))}

      {/* 7. KHUNG VÒM SÂN KHẤU & BACKDROP SÁNG SANG TRỌNG */}
      <group position={[0, 0, -18.4]}>
        {/* Vòm kim loại lớn phía ngoài */}
        <mesh position={[0, 3.6, 0]}>
          <torusGeometry args={[4.8, 0.07, 16, 64, Math.PI]} />
          <meshStandardMaterial {...PBR_MATERIALS.goldMetal} />
        </mesh>
        <mesh position={[-4.8, 1.8, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 3.6, 16]} />
          <meshStandardMaterial {...PBR_MATERIALS.goldMetal} />
        </mesh>
        <mesh position={[4.8, 1.8, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 3.6, 16]} />
          <meshStandardMaterial {...PBR_MATERIALS.goldMetal} />
        </mesh>

        {/* Vòm kim loại lớp thứ hai */}
        <mesh position={[0, 3.3, 0.2]}>
          <torusGeometry args={[4.1, 0.06, 16, 64, Math.PI]} />
          <meshStandardMaterial {...PBR_MATERIALS.goldMetal} />
        </mesh>

        {/* Tấm phông nền voan trắng sáng (không bị tối) */}
        <mesh position={[0, 3.5, -0.3]}>
          <planeGeometry args={[11, 7.0]} />
          <meshStandardMaterial
            color="#FFFFFF"
            roughness={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* 8. HỆ HOA ĐA TẦNG NỞ RỘ TRÊN KHUNG VÒM SÂN KHẤU */}
      <group name="FloralArchBlooms">
        {floralArchElements.map((item) => (
          <mesh
            key={item.id}
            position={item.pos}
            scale={item.scale}
            castShadow
          >
            {item.isLeaf ? (
              <coneGeometry args={[0.2, 0.5, 5]} />
            ) : (
              <dodecahedronGeometry args={[0.32, 1]} />
            )}
            <meshStandardMaterial
              color={item.color}
              roughness={0.65}
              metalness={0.05}
            />
          </mesh>
        ))}
      </group>

      {/* 9. DÒNG CHỮ 3D ÁNH KIM "The Thousand Bloom" & ĐÈN HÀO QUANG */}
      <group position={[0, 4.3, -18.1]}>
        {/* Nguồn sáng Halo phát sáng trực tiếp phía sau chữ */}
        <pointLight position={[0, 0, -0.1]} color="#FFF8E7" intensity={6.0} distance={5} />

        {/* Tên chủ đề chính: "The Thousand Bloom" */}
        <Text
          fontSize={0.7}
          color="#F5D77F"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#4A3B12"
          letterSpacing={0.06}
        >
          The Thousand Bloom
          <meshStandardMaterial {...PBR_MATERIALS.goldMetal} />
        </Text>

        {/* Phụ đề: "Ngàn hoa, một hành trình" */}
        <Text
          position={[0, -0.58, 0]}
          fontSize={0.25}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.14}
        >
          NGÀN HOA, MỘT HÀNH TRÌNH
        </Text>

        {/* Thanh họa tiết vàng nâng đỡ chữ */}
        <mesh position={[0, -0.85, 0]}>
          <boxGeometry args={[3.4, 0.03, 0.03]} />
          <meshStandardMaterial {...PBR_MATERIALS.goldMetal} />
        </mesh>
      </group>

      {/* 10. DÀN ĐÈN HẮT CỰC MẠNH DƯỚI CHÂN VÒM SÂN KHẤU (UPLIGHTING) */}
      <group position={[0, height + 0.05, -18.0]}>
        {[-4.0, -2.5, -1.0, 0, 1.0, 2.5, 4.0].map((uX, uIdx) => (
          <group key={`stage-uplight-${uIdx}`} position={[uX, 0, 0]}>
            {/* Vỏ đèn mạ vàng */}
            <mesh position={[0, 0.08, 0]}>
              <cylinderGeometry args={[0.12, 0.16, 0.14, 16]} />
              <meshStandardMaterial {...PBR_MATERIALS.goldMetal} />
            </mesh>
            {/* Đèn chiếu hắt lên trên với công suất cực mạnh */}
            <spotLight
              position={[0, 0.2, 0]}
              target-position={[uX * 0.7, 4.8, -18.2]}
              color="#FFF0D0"
              intensity={lightMode === 'ceremony' ? 9.0 : 6.0}
              angle={Math.PI / 3.8}
              penumbra={0.6}
              distance={15}
              castShadow
            />
            {/* Đèn PointLight phát sáng cục bộ quanh chân vòm */}
            <pointLight position={[0, 0.35, 0]} color="#FFE4B5" intensity={2.5} distance={4} />
          </group>
        ))}
      </group>

      {/* 11. BÀN CẮT BÁNH CƯỚI & THÁP LY CHAMPAGNE PHA LÊ */}
      <group position={[-4.5, height, -16.5]}>
        <mesh position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.65, 0.65, 0.9, 32]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
        </mesh>
        {[0, 1, 2, 3].map((tier) => (
          <mesh key={`cake-${tier}`} position={[0, 0.95 + tier * 0.22, 0]}>
            <cylinderGeometry args={[0.42 - tier * 0.09, 0.44 - tier * 0.09, 0.2, 32]} />
            <meshStandardMaterial color="#FFFDFC" roughness={0.2} />
          </mesh>
        ))}
        <pointLight position={[0, 2.0, 0]} color="#FFE4B5" intensity={3.0} distance={4} />
      </group>

      <group position={[4.5, height, -16.5]}>
        <mesh position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.65, 0.65, 0.9, 32]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
        </mesh>
        <mesh position={[0, 1.25, 0]}>
          <coneGeometry args={[0.45, 0.7, 8]} />
          <meshPhysicalMaterial {...PBR_MATERIALS.crystalGlass} />
        </mesh>
        <pointLight position={[0, 1.8, 0]} color="#FFF0D0" intensity={3.5} distance={4} />
      </group>
    </group>
  );
}
