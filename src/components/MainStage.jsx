import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import { PALETTE, PBR_MATERIALS } from '../constants/colors';
import { STAGE_CONFIG } from '../constants/layoutData';

/**
 * Sân khấu chính (Main Stage) phía Bắc:
 * - Khối chữ nhật lùi về sau + Mũi sân khấu hình bán nguyệt (semi-circular extension) nhô ra phía trước
 * - 1 bậc tam cấp ở chính giữa mũi bán nguyệt
 * - 2 cầu thang uốn nhẹ ở hai bên cánh gà trái / phải
 * - Hệ vòm hoa đa tầng (layered floral arch)
 * - Chữ 3D ánh kim "The Thousand Bloom" & phụ đề "Ngàn hoa, một hành trình"
 * - Hệ thống đèn hắt dưới chân vòm (uplighting)
 */
export default function MainStage({ lightMode = 'ceremony' }) {
  const { rectWidth, rectDepth, rectZ, semiRadius, semiCenterZ, height } = STAGE_CONFIG;

  // Tạo geometry cho phần bán nguyệt nhô ra phía trước
  // ExtrudeShape: Bán nguyệt từ -PI/2 đến PI/2 hoặc 0 đến PI
  const semiStageGeom = useMemo(() => {
    const shape = new THREE.Shape();
    // Bắt đầu từ mép trái khối chữ nhật tại Z = -15.5 (X = -semiRadius đến +semiRadius)
    shape.moveTo(-semiRadius, 0);
    // Vẽ cung bán nguyệt nhô về phía trước (Z dương)
    // Trong mặt phẳng 2D: X là hoành độ, Y là tung độ tương ứng với trục Z
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
    // Xoay sao cho mặt Extrude nằm ngang (Y là chiều cao)
    geom.rotateX(Math.PI / 2);
    return geom;
  }, [semiRadius, height]);

  // Tạo các cụm hoa đa tầng (Multi-tier Floral Arch) ôm theo vòm sân khấu
  const floralArchElements = useMemo(() => {
    const items = [];
    const tiers = [
      { radius: 4.8, zOffset: -18.6, count: 48, yStart: 0.8, yEnd: 6.2, spread: 0.4 },
      { radius: 4.2, zOffset: -18.2, count: 42, yStart: 0.8, yEnd: 5.6, spread: 0.35 },
      { radius: 3.6, zOffset: -17.8, count: 36, yStart: 0.8, yEnd: 4.9, spread: 0.3 }
    ];

    const flowerColors = [
      PALETTE.dustyBlue,      // Cẩm tú cầu
      PALETTE.blushPink,      // Hoa hồng phấn
      PALETTE.ivory,          // Hoa hồng trắng ngà
      PALETTE.sageGreen,      // Lá bạc
      PALETTE.dustyBlueLight,
      PALETTE.blushPinkSoft
    ];

    tiers.forEach((tier, tierIdx) => {
      for (let i = 0; i <= tier.count; i++) {
        const theta = (i / tier.count) * Math.PI; // 0 đến PI (hình bán nguyệt)
        const x = -Math.cos(theta) * tier.radius + (Math.random() - 0.5) * tier.spread;
        const y = Math.sin(theta) * (tier.yEnd - tier.yStart) + tier.yStart + (Math.random() - 0.5) * tier.spread;
        const z = tier.zOffset + (Math.random() - 0.5) * 0.3;
        const scale = 0.22 + Math.random() * 0.22;
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

  return (
    <group name="MainStage">
      {/* 1. KHỐI SÂN KHẤU CHỮ NHẬT LÙI VỀ PHÍA SAU */}
      <mesh position={[0, height / 2, rectZ]} receiveShadow castShadow>
        <boxGeometry args={[rectWidth, height, rectDepth]} />
        <meshStandardMaterial color={PALETTE.ivory} roughness={0.4} metalness={0.05} />
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
        <meshStandardMaterial color={PALETTE.ivory} roughness={0.4} metalness={0.05} />
      </mesh>

      {/* Viền kim loại mạ vàng cong quanh mũi bán nguyệt */}
      <group position={[0, height - 0.02, semiCenterZ]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[semiRadius - 0.04, semiRadius + 0.04, 64, 1, 0, Math.PI]} />
          <meshStandardMaterial {...PBR_MATERIALS.goldMetal} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* 3. BẬC TAM CẤP Ở CHÍNH GIỮA MŨI BÁN NGUYỆT (DẪN THẲNG LÊN LỐI ĐI) */}
      <group position={[0, 0, semiCenterZ + semiRadius]}>
        {/* Bậc 1 (dưới cùng) */}
        <mesh position={[0, 0.12, 0.6]} receiveShadow>
          <boxGeometry args={[3.2, 0.24, 0.5]} />
          <meshStandardMaterial color={PALETTE.ivory} roughness={0.4} />
        </mesh>
        {/* Nẹp vàng bậc 1 */}
        <mesh position={[0, 0.24, 0.85]}>
          <boxGeometry args={[3.22, 0.03, 0.05]} />
          <meshStandardMaterial {...PBR_MATERIALS.goldMetal} />
        </mesh>

        {/* Bậc 2 (ở giữa) */}
        <mesh position={[0, 0.36, 0.25]} receiveShadow>
          <boxGeometry args={[3.0, 0.24, 0.45]} />
          <meshStandardMaterial color={PALETTE.ivory} roughness={0.4} />
        </mesh>
        {/* Nẹp vàng bậc 2 */}
        <mesh position={[0, 0.48, 0.48]}>
          <boxGeometry args={[3.02, 0.03, 0.05]} />
          <meshStandardMaterial {...PBR_MATERIALS.goldMetal} />
        </mesh>

        {/* Bậc 3 (trên cùng tiếp giáp mũi sân khấu) */}
        <mesh position={[0, 0.6, -0.05]} receiveShadow>
          <boxGeometry args={[2.8, 0.24, 0.4]} />
          <meshStandardMaterial color={PALETTE.ivory} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.72, 0.15]}>
          <boxGeometry args={[2.82, 0.03, 0.05]} />
          <meshStandardMaterial {...PBR_MATERIALS.goldMetal} />
        </mesh>
      </group>

      {/* 4. HAI CẦU THANG UỐN NHẸ Ở HAI BÊN CÁNH GÀ (TRÁI / PHẢI) */}
      {/* Cầu thang cánh gà bên Trái (Left Curved Wing Stair) */}
      <group position={[-rectWidth / 2 - 0.3, 0, semiCenterZ - 0.5]} rotation={[0, Math.PI / 4, 0]}>
        {[0, 1, 2].map((stepIdx) => (
          <group key={`left-step-${stepIdx}`} position={[0, (stepIdx + 1) * 0.22, stepIdx * 0.4]}>
            <mesh receiveShadow>
              <boxGeometry args={[1.6, 0.22, 0.45]} />
              <meshStandardMaterial color={PALETTE.ivory} roughness={0.4} />
            </mesh>
            <mesh position={[0, 0.11, 0.22]}>
              <boxGeometry args={[1.62, 0.03, 0.04]} />
              <meshStandardMaterial {...PBR_MATERIALS.goldMetal} />
            </mesh>
          </group>
        ))}
        {/* Lan can uốn cong màu vàng champagne */}
        <mesh position={[-0.75, 1.0, 0.4]} rotation={[Math.PI / 6, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 1.8, 12]} />
          <meshStandardMaterial {...PBR_MATERIALS.goldMetal} />
        </mesh>
      </group>

      {/* Cầu thang cánh gà bên Phải (Right Curved Wing Stair) */}
      <group position={[rectWidth / 2 + 0.3, 0, semiCenterZ - 0.5]} rotation={[0, -Math.PI / 4, 0]}>
        {[0, 1, 2].map((stepIdx) => (
          <group key={`right-step-${stepIdx}`} position={[0, (stepIdx + 1) * 0.22, stepIdx * 0.4]}>
            <mesh receiveShadow>
              <boxGeometry args={[1.6, 0.22, 0.45]} />
              <meshStandardMaterial color={PALETTE.ivory} roughness={0.4} />
            </mesh>
            <mesh position={[0, 0.11, 0.22]}>
              <boxGeometry args={[1.62, 0.03, 0.04]} />
              <meshStandardMaterial {...PBR_MATERIALS.goldMetal} />
            </mesh>
          </group>
        ))}
        {/* Lan can uốn cong màu vàng champagne */}
        <mesh position={[0.75, 1.0, 0.4]} rotation={[Math.PI / 6, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 1.8, 12]} />
          <meshStandardMaterial {...PBR_MATERIALS.goldMetal} />
        </mesh>
      </group>

      {/* 5. KHUNG VÒM SÂN KHẤU (CHAMPAGNE GOLD ARCH FRAME) */}
      <group position={[0, 0, -18.4]}>
        {/* Vòm kim loại lớn phía ngoài */}
        <mesh position={[0, 3.6, 0]}>
          <torusGeometry args={[4.6, 0.06, 16, 64, Math.PI]} />
          <meshStandardMaterial {...PBR_MATERIALS.goldMetal} />
        </mesh>
        {/* Cột chống hai bên vòm */}
        <mesh position={[-4.6, 1.8, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 3.6, 16]} />
          <meshStandardMaterial {...PBR_MATERIALS.goldMetal} />
        </mesh>
        <mesh position={[4.6, 1.8, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 3.6, 16]} />
          <meshStandardMaterial {...PBR_MATERIALS.goldMetal} />
        </mesh>

        {/* Vòm kim loại lớp thứ hai */}
        <mesh position={[0, 3.3, 0.2]}>
          <torusGeometry args={[4.0, 0.05, 16, 64, Math.PI]} />
          <meshStandardMaterial {...PBR_MATERIALS.goldMetal} />
        </mesh>

        {/* Backdrop rèm voan thả nền có ánh đèn ấm phía sau */}
        <mesh position={[0, 3.4, -0.4]}>
          <planeGeometry args={[10, 6.5]} />
          <meshStandardMaterial
            color={PALETTE.ivory}
            roughness={0.9}
            transparent
            opacity={0.7}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* 6. HỆ HOA ĐA TẦNG NỞ RỘ TRÊN KHUNG VÒM SÂN KHẤU */}
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

      {/* 7. DÒNG CHỮ 3D ÁNH KIM "The Thousand Bloom" & PHỤ ĐỀ */}
      <group position={[0, 4.3, -18.2]}>
        {/* Tên chủ đề chính: "The Thousand Bloom" */}
        <Text
          fontSize={0.65}
          color={PALETTE.champagneGold}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#66521A"
          letterSpacing={0.06}
        >
          The Thousand Bloom
          <meshStandardMaterial {...PBR_MATERIALS.goldMetal} />
        </Text>

        {/* Phụ đề: "Ngàn hoa, một hành trình" */}
        <Text
          position={[0, -0.55, 0]}
          fontSize={0.24}
          color={PALETTE.blushPinkSoft}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.12}
        >
          NGÀN HOA, MỘT HÀNH TRÌNH
        </Text>

        {/* Thanh họa tiết vàng đối xứng nâng đỡ chữ */}
        <mesh position={[0, -0.8, 0]}>
          <boxGeometry args={[3.2, 0.02, 0.02]} />
          <meshStandardMaterial {...PBR_MATERIALS.goldMetal} />
        </mesh>
        <mesh position={[0, -0.8, 0]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial {...PBR_MATERIALS.goldMetal} />
        </mesh>
      </group>

      {/* 8. HỆ THỐNG ĐÈN HẮT DƯỚI CHÂN VÒM HOA SÂN KHẤU (UPLIGHTING) */}
      <group position={[0, height + 0.05, -18.0]}>
        {[-3.5, -1.8, 0, 1.8, 3.5].map((uX, uIdx) => (
          <group key={`uplight-${uIdx}`} position={[uX, 0, 0]}>
            {/* Vỏ đèn uplight màu vàng đồng */}
            <mesh position={[0, 0.06, 0]}>
              <cylinderGeometry args={[0.1, 0.14, 0.12, 16]} />
              <meshStandardMaterial {...PBR_MATERIALS.goldMetal} />
            </mesh>
            {/* Nguồn sáng hắt từ dưới lên vòm hoa và chữ nghệ thuật */}
            <spotLight
              position={[0, 0.15, 0]}
              target-position={[uX * 0.8, 4.5, -18.2]}
              color={PALETTE.candleWarm}
              intensity={lightMode === 'ceremony' ? 4.5 : 2.0}
              angle={Math.PI / 4}
              penumbra={0.7}
              distance={12}
              castShadow
            />
          </group>
        ))}
      </group>

      {/* Bục cắt bánh cưới & tháp ly champagne pha lê trên sân khấu */}
      <group position={[-4.5, height, -16.5]}>
        {/* Bàn tròn cắt bánh viền voan trắng */}
        <mesh position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.65, 0.65, 0.9, 32]} />
          <meshStandardMaterial color={PALETTE.ivory} roughness={0.6} />
        </mesh>
        {/* Bánh cưới 4 tầng phong cách hoa tươi */}
        {[0, 1, 2, 3].map((tier) => (
          <mesh key={`cake-${tier}`} position={[0, 0.95 + tier * 0.22, 0]}>
            <cylinderGeometry args={[0.42 - tier * 0.09, 0.44 - tier * 0.09, 0.2, 32]} />
            <meshStandardMaterial color="#FFFDFC" roughness={0.3} />
          </mesh>
        ))}
        {/* Nến trang trí quanh bánh */}
        <pointLight position={[0, 2.0, 0]} color={PALETTE.candleFlame} intensity={1.2} distance={3} />
      </group>

      {/* Tháp ly rượu Champagne pha lê bên cánh phải */}
      <group position={[4.5, height, -16.5]}>
        <mesh position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.65, 0.65, 0.9, 32]} />
          <meshStandardMaterial color={PALETTE.ivory} roughness={0.6} />
        </mesh>
        {/* Tháp ly pha lê hình kim tự tháp */}
        <mesh position={[0, 1.25, 0]}>
          <coneGeometry args={[0.45, 0.7, 8]} />
          <meshPhysicalMaterial {...PBR_MATERIALS.crystalGlass} />
        </mesh>
        <pointLight position={[0, 1.8, 0]} color={PALETTE.candleWarm} intensity={1.5} distance={3} />
      </group>
    </group>
  );
}

