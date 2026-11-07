import React, { useMemo } from 'react';
import * as THREE from 'three';
import { PALETTE, PBR_MATERIALS } from '../constants/colors';
import { AISLE_CONFIG } from '../constants/layoutData';

/**
 * Trục chính & Thảm lối đi trung tâm (Center Aisle):
 * - Thảm trắng kem (Ivory `#F8F6F0`) từ cửa sảnh chính Z = 20m dẫn thẳng lên mũi sân khấu Z = -11m
 * - Hai bên mép thảm: Các dải hoa tươi thấp (Dusty Blue, Blush Pink, Sage Green, Ivory)
 * - Đan xen trụ nến thủy tinh cao thấp (glass hurricane lamps) phát sáng lung linh
 */
export default function CenterAisle({ lightMode = 'ceremony' }) {
  const { width, startZ, endZ } = AISLE_CONFIG;
  const aisleLength = startZ - endZ;
  const centerZ = (startZ + endZ) / 2;

  // Sinh các cụm hoa & trụ nến dọc hai bên mép thảm
  const aisleDecorations = useMemo(() => {
    const decors = [];
    const stepZ = 1.35; // Khoảng cách giữa các cụm dọc trục Z
    const numSteps = Math.floor(aisleLength / stepZ);

    const flowerColors = [
      PALETTE.dustyBlue,
      PALETTE.blushPink,
      PALETTE.ivory,
      PALETTE.sageGreen,
      PALETTE.dustyBlueLight
    ];

    for (let i = 0; i < numSteps; i++) {
      const zPos = startZ - (i * stepZ) - 0.5;
      if (zPos < endZ + 0.3) break;

      // Bên Trái (Left edge: X ≈ -width / 2 - 0.2)
      // Bên Phải (Right edge: X ≈ +width / 2 + 0.2)
      [-1, 1].forEach((side) => {
        const baseX = side * (width / 2 + 0.22);

        // 1. Cụm hoa thấp gồm 4-6 bông hoa/lá kết cụm
        const clusterFlowers = [];
        for (let f = 0; f < 5; f++) {
          clusterFlowers.push({
            id: `f-${side}-${i}-${f}`,
            ox: (Math.random() - 0.5) * 0.35,
            oz: (Math.random() - 0.5) * 0.5,
            scale: 0.12 + Math.random() * 0.1,
            color: flowerColors[Math.floor(Math.random() * flowerColors.length)],
            isLeaf: Math.random() > 0.65
          });
        }

        // 2. Bộ 2 hoặc 3 trụ nến thủy tinh cao thấp khác nhau
        const candles = [
          { height: 0.45, radius: 0.08, ox: (side * 0.08), oz: -0.15 },
          { height: 0.32, radius: 0.07, ox: -(side * 0.08), oz: 0.15 }
        ];

        decors.push({
          id: `decor-${side}-${i}`,
          side,
          x: baseX,
          z: zPos,
          flowers: clusterFlowers,
          candles,
          hasPointLight: i % 3 === 0 // Đặt nguồn sáng pointLight mỗi 3 bước để tối ưu hiệu năng
        });
      });
    }

    return decors;
  }, [aisleLength, startZ, endZ, width]);

  return (
    <group name="CenterAisle">
      {/* 1. THẢM LỐI ĐI CHÍNH MÀU TRẮNG KEM (IVORY RUNNER) */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.015, centerZ]}
        receiveShadow
      >
        <planeGeometry args={[width, aisleLength]} />
        <meshStandardMaterial
          color={PALETTE.ivory}
          roughness={PBR_MATERIALS.carpet.roughness}
          metalness={PBR_MATERIALS.carpet.metalness}
        />
      </mesh>

      {/* Nẹp viền kim loại Champagne Gold hai bên mép thảm */}
      <mesh position={[-width / 2, 0.02, centerZ]}>
        <boxGeometry args={[0.06, 0.01, aisleLength]} />
        <meshStandardMaterial {...PBR_MATERIALS.goldMetal} />
      </mesh>
      <mesh position={[width / 2, 0.02, centerZ]}>
        <boxGeometry args={[0.06, 0.01, aisleLength]} />
        <meshStandardMaterial {...PBR_MATERIALS.goldMetal} />
      </mesh>

      {/* Hoa văn dải trang trí nhũ vàng chạy dọc tâm thảm */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, centerZ]}>
        <planeGeometry args={[0.15, aisleLength]} />
        <meshStandardMaterial
          color={PALETTE.champagneGold}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* 2. DỌC HAI BÊN MÉP THẢM: CỤM HOA TƯƠI & TRỤ NẾN THỦY TINH */}
      <group name="AisleDecorations">
        {aisleDecorations.map((item) => (
          <group key={item.id} position={[item.x, 0, item.z]}>
            {/* Cụm hoa thấp */}
            {item.flowers.map((fl) => (
              <mesh
                key={fl.id}
                position={[fl.ox, fl.scale, fl.oz]}
                scale={fl.scale}
                castShadow
              >
                {fl.isLeaf ? (
                  <coneGeometry args={[0.16, 0.4, 5]} />
                ) : (
                  <dodecahedronGeometry args={[0.26, 1]} />
                )}
                <meshStandardMaterial
                  color={fl.color}
                  roughness={0.65}
                  metalness={0.05}
                />
              </mesh>
            ))}

            {/* Các trụ nến thủy tinh cao thấp */}
            {item.candles.map((candle, cIdx) => (
              <group key={`c-${cIdx}`} position={[candle.ox, 0, candle.oz]}>
                {/* Ống thủy tinh trụ trong suốt (Glass Hurricane Cylinder) */}
                <mesh position={[0, candle.height / 2, 0]}>
                  <cylinderGeometry args={[candle.radius, candle.radius, candle.height, 16, 1, true]} />
                  <meshPhysicalMaterial
                    color="#FFFFFF"
                    transmission={0.92}
                    opacity={0.7}
                    transparent
                    roughness={0.08}
                    ior={1.5}
                  />
                </mesh>

                {/* Thân nến sáp trắng ngà bên trong */}
                <mesh position={[0, (candle.height * 0.55) / 2, 0]}>
                  <cylinderGeometry
                    args={[candle.radius * 0.65, candle.radius * 0.65, candle.height * 0.55, 16]}
                  />
                  <meshStandardMaterial color={PALETTE.ivorySoft} roughness={0.7} />
                </mesh>

                {/* Ngọn lửa nến phát sáng */}
                <mesh position={[0, candle.height * 0.55 + 0.03, 0]}>
                  <sphereGeometry args={[0.018, 12, 12]} />
                  <meshBasicMaterial color={PALETTE.candleFlame} />
                </mesh>
              </group>
            ))}

            {/* Nguồn sáng PointLight ấm áp tỏa ra từ nến */}
            {item.hasPointLight && (
              <pointLight
                position={[0, 0.4, 0]}
                color={PALETTE.candleWarm}
                intensity={lightMode === 'ceremony' ? 0.9 : 0.4}
                distance={3.2}
                decay={2}
              />
            )}
          </group>
        ))}
      </group>

      {/* Cụm hoa lớn đón tiếp tại đầu lối đi (ngay cửa bước vào Z = 19.5m) */}
      {[-width / 2 - 0.4, width / 2 + 0.4].map((posX, pIdx) => (
        <group key={`entrance-urn-${pIdx}`} position={[posX, 0, startZ - 0.6]}>
          {/* Đôn hoa kim loại mạ vàng */}
          <mesh position={[0, 0.45, 0]}>
            <cylinderGeometry args={[0.3, 0.38, 0.9, 16]} />
            <meshStandardMaterial {...PBR_MATERIALS.goldMetal} />
          </mesh>
          {/* Cụm hoa lớn dạng cầu tròn đón khách */}
          <mesh position={[0, 1.15, 0]} castShadow>
            <sphereGeometry args={[0.55, 16, 16]} />
            <meshStandardMaterial color={PALETTE.dustyBlue} roughness={0.7} />
          </mesh>
          <mesh position={[0.15, 1.35, 0.1]} scale={0.4}>
            <sphereGeometry args={[0.5, 12, 12]} />
            <meshStandardMaterial color={PALETTE.blushPink} roughness={0.7} />
          </mesh>
          <mesh position={[-0.15, 1.25, -0.1]} scale={0.45}>
            <sphereGeometry args={[0.5, 12, 12]} />
            <meshStandardMaterial color={PALETTE.ivory} roughness={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

