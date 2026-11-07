import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Sparkles } from '@react-three/drei';
import { PALETTE, PBR_MATERIALS } from '../constants/colors';
import { BALLROOM_DIMENSIONS } from '../constants/layoutData';

/**
 * Trần sảnh & Hệ thống trang trí trên cao (Ceiling & Hanging Decor):
 * - Đèn chùm pha lê (Crystal Chandeliers) phân bố đối xứng
 * - Dải hoa treo trần (Hanging Floral Garlands & Runners)
 * - Hạt sáng li ti (Fairy Lights / Sparkles) lấp lánh như ngàn vì sao
 */
export default function CeilingAndDecor({ lightMode = 'ceremony' }) {
  const { width, length, height } = BALLROOM_DIMENSIONS;

  // Tọa độ các đèn chùm pha lê hoàng gia
  // Bố trí 2 dãy chạy dọc sảnh (X = -7m và X = +7m) cùng 3 đèn chùm lớn dọc tâm lối đi
  const chandelierPositions = useMemo(() => {
    const list = [];
    const zSteps = [-12, -4, 4, 12];

    // Dãy bên Trái
    zSteps.forEach((z) => list.push({ pos: [-7.0, height - 1.4, z], size: 1.1, intensity: 2.2 }));
    // Dãy bên Phải
    zSteps.forEach((z) => list.push({ pos: [7.0, height - 1.4, z], size: 1.1, intensity: 2.2 }));
    // Dọc tâm lối đi (3 đèn chùm hoa văn lớn)
    [-8, 0, 8].forEach((z) => list.push({ pos: [0, height - 1.6, z], size: 1.4, intensity: 3.0 }));

    return list;
  }, [height]);

  // Tạo các dải hoa treo trần (Floral Garlands) chạy ngang qua sảnh tiệc
  const hangingGarlands = useMemo(() => {
    const garlands = [];
    const garlandZ = [-14, -8, -2, 4, 10, 16];
    const flowerColors = [PALETTE.dustyBlue, PALETTE.blushPink, PALETTE.ivory, PALETTE.sageGreen];

    garlandZ.forEach((z, gIdx) => {
      // Mỗi dải hoa gồm 35 cụm hoa rủ võng nhẹ
      const bloomClusters = [];
      for (let i = 0; i < 30; i++) {
        const x = -13 + (i / 30) * 26;
        // Đường cong võng Parabol hoặc Catenary
        const sag = Math.sin((i / 30) * Math.PI) * 0.8;
        const y = height - 0.5 - sag + (Math.random() - 0.5) * 0.15;
        bloomClusters.push({
          id: `g-${gIdx}-${i}`,
          x,
          y,
          z: z + (Math.random() - 0.5) * 0.3,
          scale: 0.18 + Math.random() * 0.15,
          color: flowerColors[Math.floor(Math.random() * flowerColors.length)],
          dropLength: 0.2 + Math.random() * 0.4
        });
      }
      garlands.push({ id: `garland-${gIdx}`, blooms: bloomClusters });
    });

    return garlands;
  }, [height]);

  return (
    <group name="CeilingAndDecor">
      {/* 1. HỆ THỐNG ĐÈN CHÙM PHA LÊ (CRYSTAL CHANDELIERS) */}
      <group name="Chandeliers">
        {chandelierPositions.map((ch, idx) => (
          <group key={`chandelier-${idx}`} position={ch.pos}>
            {/* Dây xích treo mạ vàng từ xà trần xuống */}
            <mesh position={[0, 0.7, 0]}>
              <cylinderGeometry args={[0.015, 0.015, 1.4, 8]} />
              <meshStandardMaterial {...PBR_MATERIALS.goldMetal} />
            </mesh>

            {/* Vòng kim loại chính mạ vàng */}
            <mesh position={[0, 0, 0]}>
              <torusGeometry args={[ch.size * 0.45, 0.03, 12, 32]} />
              <meshStandardMaterial {...PBR_MATERIALS.goldMetal} />
            </mesh>

            {/* Vòng pha lê đa tầng trên */}
            <mesh position={[0, 0.15, 0]}>
              <coneGeometry args={[ch.size * 0.35, 0.4, 16, 1, true]} />
              <meshPhysicalMaterial {...PBR_MATERIALS.crystalGlass} />
            </mesh>

            {/* Vòng pha lê rủ giọt tầng dưới */}
            <mesh position={[0, -0.3, 0]}>
              <coneGeometry args={[ch.size * 0.48, 0.7, 16, 1, true]} />
              <meshPhysicalMaterial {...PBR_MATERIALS.crystalGlass} />
            </mesh>

            {/* Quả cầu pha lê trung tâm (Crystal Finial) */}
            <mesh position={[0, -0.7, 0]}>
              <octahedronGeometry args={[0.15, 2]} />
              <meshPhysicalMaterial {...PBR_MATERIALS.crystalGlass} />
            </mesh>

            {/* Nguồn sáng ấm vàng Champagne Gold tỏa ra từ đèn chùm */}
            <pointLight
              position={[0, -0.2, 0]}
              color={PALETTE.candleWarm}
              intensity={lightMode === 'ceremony' ? ch.intensity * 0.7 : ch.intensity * 1.2}
              distance={14}
              decay={2}
            />
          </group>
        ))}
      </group>

      {/* 2. DẢI HOA TREO TRẦN (HANGING FLORAL GARLANDS) */}
      <group name="FloralGarlands">
        {hangingGarlands.map((g) => (
          <group key={g.id}>
            {g.blooms.map((bl) => (
              <group key={bl.id} position={[bl.x, bl.y, bl.z]}>
                {/* Bông hoa/tán lá */}
                <mesh scale={bl.scale} castShadow>
                  <dodecahedronGeometry args={[0.26, 1]} />
                  <meshStandardMaterial color={bl.color} roughness={0.7} />
                </mesh>
                {/* Dây rủ cành lá mềm xanh nhạt */}
                <mesh position={[0, -bl.dropLength / 2, 0]}>
                  <cylinderGeometry args={[0.008, 0.005, bl.dropLength, 6]} />
                  <meshStandardMaterial color={PALETTE.sageGreenDark} roughness={0.8} />
                </mesh>
              </group>
            ))}
          </group>
        ))}
      </group>

      {/* 3. HẠT SÁNG LI TI (FAIRY LIGHTS / SPARKLES) */}
      <Sparkles
        count={280}
        scale={[width - 2, 5, length - 4]}
        position={[0, height / 2 + 0.5, 0]}
        size={3.2}
        speed={0.4}
        color={PALETTE.goldHighlight}
        opacity={lightMode === 'ceremony' ? 0.85 : 0.45}
      />

      {/* Rèm dây đèn Fairy Lights thả nhẹ phía tường sau sân khấu */}
      <Sparkles
        count={120}
        scale={[12, 6, 1]}
        position={[0, 4.2, -19.2]}
        size={2.4}
        speed={0.2}
        color={PALETTE.candleWarm}
        opacity={0.9}
      />
    </group>
  );
}

