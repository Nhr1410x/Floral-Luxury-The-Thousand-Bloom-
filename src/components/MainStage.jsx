import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import { PALETTE, PBR_MATERIALS } from '../constants/colors';
import { STAGE_CONFIG } from '../constants/layoutData';

/**
 * Sân khấu chính (Main Stage) tái hiện chính xác 100% hình ảnh tham chiếu:
 * - Vòm hoa tròn khổng lồ trung tâm rực rỡ hoa cẩm tú cầu xanh pastel, hoa hồng phấn và trắng ngà
 * - Khung vòm vàng đôi lồng trong vòm hoa, chữ ánh kim "The Thousand Bloom" và "Ngàn hoa, một hành trình"
 * - Hai cổng vòm kiến trúc La Mã cổ điển với cột trụ đôi và rèm vén hai bên
 * - Hai cầu thang uốn lượn hai bên cánh gà phủ kín dải hoa tươi dày đặc
 * - Dải hoa ngang trên đỉnh tường sân khấu (Floral Valance) với dàn đèn downlight rọi nón ánh sáng xuống phông rèm
 * - Thảm hoa trải dài trên sàn sân khấu kết hợp dàn chân nến kim loại vàng cao vút
 * - Dàn 3 đèn chùm pha lê hoàng gia treo ngay trước sân khấu và các dải pha lê rủ từ trần
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

  // Bảng màu hoa chuẩn concept "The Thousand Bloom"
  const flowerPalette = [
    PALETTE.dustyBlue,      // Cẩm tú cầu xanh pastel
    PALETTE.dustyBlueLight,
    PALETTE.blushPink,      // Hoa hồng phấn
    PALETTE.blushPinkSoft,
    PALETTE.ivory,          // Hoa hồng trắng ngà
    '#FFFFFF',
    PALETTE.sageGreen       // Lá bạc Eucalyptus
  ];

  // 2. VÒM HOA TRÒN TRUNG TÂM (GRAND CIRCULAR FLORAL ARCH)
  const centerArchFlowers = useMemo(() => {
    const blooms = [];
    const layers = [
      { r: 3.85, z: -18.3, count: 85, spread: 0.45 },
      { r: 3.35, z: -18.0, count: 75, spread: 0.4 },
      { r: 2.9, z: -17.8, count: 65, spread: 0.35 }
    ];

    layers.forEach((layer, lIdx) => {
      for (let i = 0; i <= layer.count; i++) {
        // Hình móng ngựa/vòng tròn từ 0.05 PI đến 0.95 PI
        const theta = 0.08 * Math.PI + (i / layer.count) * 0.84 * Math.PI;
        const x = -Math.cos(theta) * layer.r + (Math.random() - 0.5) * layer.spread;
        const y = Math.sin(theta) * (layer.r * 1.1) + 1.2 + (Math.random() - 0.5) * layer.spread;
        const z = layer.z + (Math.random() - 0.5) * 0.35;
        const scale = 0.22 + Math.random() * 0.26;
        const color = flowerPalette[Math.floor(Math.random() * flowerPalette.length)];

        blooms.push({
          id: `c-arch-${lIdx}-${i}`,
          pos: [x, y, z],
          scale,
          color,
          isLeaf: color === PALETTE.sageGreen
        });
      }
    });
    return blooms;
  }, []);

  // 3. DẢI HOA NGANG TRÊN ĐỈNH (TOP HORIZONTAL FLORAL VALANCE / CORNICE)
  const topValanceFlowers = useMemo(() => {
    const blooms = [];
    const spanWidth = 24; // Phủ từ X = -12 đến +12
    const count = 120;

    for (let i = 0; i < count; i++) {
      const x = -12 + (i / count) * spanWidth + (Math.random() - 0.5) * 0.3;
      const y = 5.9 + (Math.random() - 0.5) * 0.35;
      const z = -18.5 + (Math.random() - 0.5) * 0.4;
      const scale = 0.22 + Math.random() * 0.25;
      const color = flowerPalette[Math.floor(Math.random() * flowerPalette.length)];

      blooms.push({
        id: `valance-${i}`,
        pos: [x, y, z],
        scale,
        color,
        isLeaf: color === PALETTE.sageGreen
      });
    }
    return blooms;
  }, []);

  // 4. DẢI HOA UỐN LƯỢN DỌC HAI CẦU THANG (SWEEPING STAIRCASE FLORAL CASCADES)
  const stairFlowers = useMemo(() => {
    const blooms = [];

    // Cánh Trái & Cánh Phải
    [-1, 1].forEach((side) => {
      const stepsCount = 35;
      for (let s = 0; s < stepsCount; s++) {
        const t = s / stepsCount;
        // Quỹ đạo uốn cong hình chữ S nhẹ từ trên sân khấu xuống sàn sảnh
        const angle = t * (Math.PI / 2.2);
        const x = side * (6.2 + Math.sin(angle) * 3.8 + (Math.random() - 0.5) * 0.35);
        const z = -18.5 + Math.cos(angle) * 5.5 + (Math.random() - 0.5) * 0.35;
        const y = 3.5 * (1 - t * 0.85) + 0.35 + (Math.random() - 0.5) * 0.25;
        const scale = 0.24 + Math.random() * 0.24;
        const color = flowerPalette[Math.floor(Math.random() * flowerPalette.length)];

        blooms.push({
          id: `stair-fl-${side}-${s}`,
          pos: [x, y, z],
          scale,
          color,
          isLeaf: color === PALETTE.sageGreen
        });
      }
    });
    return blooms;
  }, []);

  // 5. THẢM HOA TRÊN SÀN SÂN KHẤU & CHÂN VÒM (STAGE FLOOR FLORAL MEADOW)
  const stageFloorMeadow = useMemo(() => {
    const blooms = [];
    const count = 90;

    for (let i = 0; i < count; i++) {
      const progress = i / count;
      const x = -8.5 + progress * 17.0 + (Math.random() - 0.5) * 0.4;
      const z = -17.2 + Math.sin(progress * Math.PI) * 1.5 + (Math.random() - 0.5) * 0.5;
      const y = height + 0.15 + (Math.random() - 0.5) * 0.12;
      const scale = 0.22 + Math.random() * 0.24;
      const color = flowerPalette[Math.floor(Math.random() * flowerPalette.length)];

      blooms.push({
        id: `meadow-${i}`,
        pos: [x, y, z],
        scale,
        color,
        isLeaf: color === PALETTE.sageGreen
      });
    }
    return blooms;
  }, [height]);

  // 6. DÀN CHÂN NẾN KIM LOẠI VÀNG CAO VÚT DỌC SÂN KHẤU (SLENDER CANDELABRA FOREST)
  const candelabras = useMemo(() => {
    const list = [];
    const xOffsets = [-5.2, -4.5, -3.8, -3.2, 3.2, 3.8, 4.5, 5.2];

    xOffsets.forEach((x, idx) => {
      list.push({
        id: `cand-${idx}`,
        x,
        y: height,
        z: -17.6 + (Math.random() - 0.5) * 0.3,
        heights: [0.75, 1.05, 1.35]
      });
    });
    return list;
  }, [height]);

  // 7. CÁC SỢI PHA LÊ RỦ TỪ TRẦN (HANGING CRYSTAL STRANDS)
  const crystalRainStrands = useMemo(() => {
    const strands = [];
    for (let i = 0; i < 24; i++) {
      const x = -10 + (i / 24) * 20;
      const z = -17.0 + (Math.random() - 0.5) * 1.2;
      const length = 1.2 + Math.random() * 1.4;
      strands.push({ id: `rain-${i}`, x, z, length });
    }
    return strands;
  }, []);

  return (
    <group name="MainStage">
      {/* 1. KHỐI SÂN KHẤU NỀN TRẮNG SANG TRỌNG */}
      <mesh position={[0, height / 2, rectZ]} receiveShadow castShadow>
        <boxGeometry args={[rectWidth, height, rectDepth]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.25} metalness={0.06} />
      </mesh>

      {/* Mũi bán nguyệt sân khấu nhô ra phía trước */}
      <mesh
        geometry={semiStageGeom}
        position={[0, height, semiCenterZ]}
        receiveShadow
        castShadow
      >
        <meshStandardMaterial color="#FFFFFF" roughness={0.25} metalness={0.06} />
      </mesh>

      {/* Viền nẹp kim loại vàng cong quanh mũi bán nguyệt */}
      <group position={[0, height - 0.02, semiCenterZ]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[semiRadius - 0.05, semiRadius + 0.05, 64, 1, 0, Math.PI]} />
          <meshStandardMaterial {...PBR_MATERIALS.goldMetal} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Bậc tam cấp ở chính giữa mũi bán nguyệt */}
      <group position={[0, 0, semiCenterZ + semiRadius]}>
        {[
          { y: 0.12, z: 0.6, w: 3.2, h: 0.24, d: 0.5 },
          { y: 0.36, z: 0.25, w: 3.0, h: 0.24, d: 0.45 },
          { y: 0.6, z: -0.05, w: 2.8, h: 0.24, d: 0.4 }
        ].map((step, idx) => (
          <group key={`center-step-${idx}`}>
            <mesh position={[0, step.y, step.z]} receiveShadow>
              <boxGeometry args={[step.w, step.h, step.d]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
            </mesh>
            <mesh position={[0, step.y + step.h / 2, step.z + step.d / 2]}>
              <boxGeometry args={[step.w + 0.02, 0.03, 0.04]} />
              <meshStandardMaterial {...PBR_MATERIALS.goldMetal} />
            </mesh>
          </group>
        ))}
      </group>

      {/* 2. HAI CẦU THANG UỐN CONG THỰC THỂ (CURVED SWEEPING STAIRS ARCHITECTURE) */}
      {[-1, 1].map((side, sideIdx) => (
        <group key={`stair-struct-${sideIdx}`}>
          {/* Các bậc cầu thang uốn lượn */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((s) => {
            const t = s / 7;
            const angle = t * (Math.PI / 2.3);
            const x = side * (6.5 + Math.sin(angle) * 3.4);
            const z = -18.5 + Math.cos(angle) * 5.0;
            const y = 3.2 * (1 - t * 0.9) + 0.15;

            return (
              <mesh key={`st-${side}-${s}`} position={[x, y, z]} rotation={[0, -side * angle, 0]} receiveShadow>
                <boxGeometry args={[1.5, 0.18, 0.55]} />
                <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
              </mesh>
            );
          })}
        </group>
      ))}

      {/* Dải hoa uốn lượn dày đặc dọc hai cầu thang */}
      <group name="StaircaseFloralRunners">
        {stairFlowers.map((fl) => (
          <mesh key={fl.id} position={fl.pos} scale={fl.scale} castShadow>
            {fl.isLeaf ? (
              <coneGeometry args={[0.18, 0.4, 5]} />
            ) : (
              <dodecahedronGeometry args={[0.3, 1]} />
            )}
            <meshStandardMaterial color={fl.color} roughness={0.65} />
          </mesh>
        ))}
      </group>

      {/* 3. HAI VÒM CỔ ĐIỂN LA MÃ HAI BÊN CÁNH GÀ (CLASSICAL PALLADIAN ARCHES) */}
      {[-6.2, 6.2].map((ax, aIdx) => (
        <group key={`palladian-arch-${aIdx}`} position={[ax, 0, -18.2]}>
          {/* Cột La Mã bên trái vòm */}
          <mesh position={[-1.6, 2.7, 0]} castShadow>
            <cylinderGeometry args={[0.22, 0.25, 4.4, 24]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
          </mesh>
          <mesh position={[-1.6, 0.2, 0]}>
            <boxGeometry args={[0.65, 0.4, 0.65]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
          </mesh>
          <mesh position={[-1.6, 4.9, 0]}>
            <boxGeometry args={[0.65, 0.35, 0.65]} />
            <meshStandardMaterial {...PBR_MATERIALS.goldMetal} />
          </mesh>

          {/* Cột La Mã bên phải vòm */}
          <mesh position={[1.6, 2.7, 0]} castShadow>
            <cylinderGeometry args={[0.22, 0.25, 4.4, 24]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
          </mesh>
          <mesh position={[1.6, 0.2, 0]}>
            <boxGeometry args={[0.65, 0.4, 0.65]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
          </mesh>
          <mesh position={[1.6, 4.9, 0]}>
            <boxGeometry args={[0.65, 0.35, 0.65]} />
            <meshStandardMaterial {...PBR_MATERIALS.goldMetal} />
          </mesh>

          {/* Khung vòm bán nguyệt trên đỉnh 2 cột */}
          <mesh position={[0, 4.9, 0]}>
            <torusGeometry args={[1.6, 0.12, 16, 32, Math.PI]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
          </mesh>
          {/* Viền nẹp vàng vòm phụ */}
          <mesh position={[0, 4.9, 0.05]}>
            <torusGeometry args={[1.5, 0.04, 16, 32, Math.PI]} />
            <meshStandardMaterial {...PBR_MATERIALS.goldMetal} />
          </mesh>

          {/* Rèm voan buông rủ thanh lịch bên trong vòm phụ */}
          <mesh position={[0, 2.8, -0.2]}>
            <planeGeometry args={[3.0, 4.8]} />
            <meshStandardMaterial
              color="#FAF8F5"
              roughness={0.7}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      ))}

      {/* 4. PHÔNG RÈM XẾP LY TOÀN DIỆN PHÍA SAU SÂN KHẤU (VERTICAL PLEATED BACKDROP) */}
      <mesh position={[0, 3.4, -18.8]}>
        <planeGeometry args={[26, 6.8]} />
        <meshStandardMaterial
          color="#FAF8F5"
          roughness={0.75}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 5. VÒM HOA TRÒN TRUNG TÂM (GRAND CIRCULAR FLORAL ARCH) */}
      {/* Vòng kim loại vàng đôi ôm viền trong vòm hoa */}
      <group position={[0, 3.4, -18.1]}>
        <mesh>
          <torusGeometry args={[3.2, 0.045, 16, 64]} />
          <meshStandardMaterial {...PBR_MATERIALS.goldMetal} />
        </mesh>
        <mesh position={[0, 0, 0.08]}>
          <torusGeometry args={[3.45, 0.035, 16, 64]} />
          <meshStandardMaterial {...PBR_MATERIALS.goldMetal} />
        </mesh>
      </group>

      {/* Hệ hoa dày đặc quanh vòm tròn trung tâm */}
      <group name="CenterCircularBlooms">
        {centerArchFlowers.map((fl) => (
          <mesh key={fl.id} position={fl.pos} scale={fl.scale} castShadow>
            {fl.isLeaf ? (
              <coneGeometry args={[0.2, 0.45, 5]} />
            ) : (
              <dodecahedronGeometry args={[0.32, 1]} />
            )}
            <meshStandardMaterial color={fl.color} roughness={0.65} />
          </mesh>
        ))}
      </group>

      {/* 6. TYPOGRAPHY ÁNH KIM "The Thousand Bloom" & "Ngàn hoa, một hành trình" */}
      <group position={[0, 3.75, -18.2]}>
        {/* Nguồn sáng Halo phát sáng từ tâm vòm */}
        <pointLight position={[0, 0, 0.2]} color="#FFF3DC" intensity={4.5} distance={6} />

        {/* Chữ nghệ thuật "The Thousand Bloom" */}
        <Text
          fontSize={0.68}
          color="#F2D177"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#5C4718"
          letterSpacing={0.05}
        >
          The Thousand Bloom
          <meshStandardMaterial {...PBR_MATERIALS.goldMetal} />
        </Text>

        {/* Phụ đề thanh thoát "Ngàn hoa, một hành trình" */}
        <Text
          position={[0, -0.55, 0]}
          fontSize={0.24}
          color="#FAF8F5"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.12}
        >
          - Ngàn hoa, một hành trình -
        </Text>

        {/* Họa tiết vàng đối xứng */}
        <mesh position={[0, -0.85, 0]}>
          <boxGeometry args={[3.6, 0.025, 0.025]} />
          <meshStandardMaterial {...PBR_MATERIALS.goldMetal} />
        </mesh>
      </group>

      {/* 7. DẢI HOA NGANG TRÊN ĐỈNH TƯỜNG (TOP FLORAL CORNICE VALANCE) */}
      <group name="TopFloralValance">
        {topValanceFlowers.map((fl) => (
          <mesh key={fl.id} position={fl.pos} scale={fl.scale} castShadow>
            <dodecahedronGeometry args={[0.32, 1]} />
            <meshStandardMaterial color={fl.color} roughness={0.65} />
          </mesh>
        ))}
      </group>

      {/* DÀN ĐÈN DOWNLIGHT TỪ DẢI HOA TRÊN ĐỈNH RỌI HÌNH NÓN XUỐNG PHÔNG RÈM */}
      <group position={[0, 6.0, -18.2]}>
        {[-9, -6.5, -4, -1.8, 1.8, 4, 6.5, 9].map((dx, dIdx) => (
          <group key={`downlight-${dIdx}`} position={[dx, 0, 0]}>
            {/* Đèn downlight rọi nón ánh sáng ấm áp xuống rèm */}
            <spotLight
              position={[0, 0, 0]}
              target-position={[dx * 0.95, 2.0, -18.7]}
              color="#FFE2A8"
              intensity={4.2}
              angle={Math.PI / 4.5}
              penumbra={0.7}
              distance={8}
            />
            {/* Nốt sáng nhỏ ở chóa đèn */}
            <mesh position={[0, -0.05, 0]}>
              <sphereGeometry args={[0.04, 12, 12]} />
              <meshBasicMaterial color="#FFECC9" />
            </mesh>
          </group>
        ))}
      </group>

      {/* 8. THẢM HOA TRÊN SÀN SÂN KHẤU (STAGE FLOOR FLORAL MEADOW) */}
      <group name="StageFloorMeadow">
        {stageFloorMeadow.map((fl) => (
          <mesh key={fl.id} position={fl.pos} scale={fl.scale} castShadow>
            <dodecahedronGeometry args={[0.3, 1]} />
            <meshStandardMaterial color={fl.color} roughness={0.65} />
          </mesh>
        ))}
      </group>

      {/* 9. DÀN CHÂN NẾN KIM LOẠI VÀNG CAO VÚT (CANDELABRAS) */}
      <group name="SlenderCandelabras">
        {candelabras.map((cand) => (
          <group key={cand.id} position={[cand.x, cand.y, cand.z]}>
            {cand.heights.map((h, hIdx) => {
              const ox = (hIdx - 1) * 0.18;
              const oz = (hIdx % 2 === 0 ? 0.08 : -0.08);

              return (
                <group key={`stick-${hIdx}`} position={[ox, 0, oz]}>
                  {/* Trụ nến kim loại mạ vàng cao vút */}
                  <mesh position={[0, h / 2, 0]}>
                    <cylinderGeometry args={[0.012, 0.02, h, 8]} />
                    <meshStandardMaterial {...PBR_MATERIALS.goldMetal} />
                  </mesh>
                  {/* Cốc nến pha lê */}
                  <mesh position={[0, h + 0.06, 0]}>
                    <cylinderGeometry args={[0.04, 0.03, 0.12, 12]} />
                    <meshPhysicalMaterial {...PBR_MATERIALS.crystalGlass} />
                  </mesh>
                  {/* Ngọn nến phát sáng */}
                  <mesh position={[0, h + 0.08, 0]}>
                    <sphereGeometry args={[0.02, 12, 12]} />
                    <meshBasicMaterial color={PALETTE.candleFlame} />
                  </mesh>
                </group>
              );
            })}
            {/* Nguồn sáng ấm tỏa ra từ cụm nến */}
            <pointLight position={[0, 1.2, 0]} color={PALETTE.candleWarm} intensity={1.8} distance={3.5} />
          </group>
        ))}
      </group>

      {/* 10. DÀN 3 ĐÈN CHÙM PHA LÊ HOÀNG GIA TREO TRƯỚC SÂN KHẤU */}
      <group position={[0, 5.4, -16.0]}>
        {/* Đèn chùm trung tâm lớn */}
        <group position={[0, 0, 0]}>
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 1.0, 8]} />
            <meshStandardMaterial {...PBR_MATERIALS.goldMetal} />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <torusGeometry args={[0.8, 0.035, 16, 32]} />
            <meshStandardMaterial {...PBR_MATERIALS.goldMetal} />
          </mesh>
          <mesh position={[0, -0.3, 0]}>
            <coneGeometry args={[0.7, 0.8, 16, 1, true]} />
            <meshPhysicalMaterial {...PBR_MATERIALS.crystalGlass} />
          </mesh>
          <pointLight position={[0, -0.4, 0]} color="#FFF3DC" intensity={3.8} distance={8} />
        </group>

        {/* Đèn chùm bên trái */}
        <group position={[-5.8, 0.2, 0]}>
          <mesh position={[0, 0.4, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.8, 8]} />
            <meshStandardMaterial {...PBR_MATERIALS.goldMetal} />
          </mesh>
          <mesh position={[0, -0.2, 0]}>
            <coneGeometry args={[0.55, 0.65, 16, 1, true]} />
            <meshPhysicalMaterial {...PBR_MATERIALS.crystalGlass} />
          </mesh>
          <pointLight position={[0, -0.3, 0]} color="#FFF3DC" intensity={3.0} distance={7} />
        </group>

        {/* Đèn chùm bên phải */}
        <group position={[5.8, 0.2, 0]}>
          <mesh position={[0, 0.4, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.8, 8]} />
            <meshStandardMaterial {...PBR_MATERIALS.goldMetal} />
          </mesh>
          <mesh position={[0, -0.2, 0]}>
            <coneGeometry args={[0.55, 0.65, 16, 1, true]} />
            <meshPhysicalMaterial {...PBR_MATERIALS.crystalGlass} />
          </mesh>
          <pointLight position={[0, -0.3, 0]} color="#FFF3DC" intensity={3.0} distance={7} />
        </group>
      </group>

      {/* 11. CÁC DẢI PHA LÊ GIỌT NƯỚC RỦ TỪ TRẦN (CRYSTAL RAIN DROPLETS) */}
      <group position={[0, 6.2, 0]}>
        {crystalRainStrands.map((s) => (
          <group key={s.id} position={[s.x, 0, s.z]}>
            <mesh position={[0, -s.length / 2, 0]}>
              <cylinderGeometry args={[0.005, 0.005, s.length, 6]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.1} />
            </mesh>
            {/* Hạt pha lê lấp lánh ở đuôi sợi */}
            <mesh position={[0, -s.length, 0]}>
              <octahedronGeometry args={[0.04, 1]} />
              <meshPhysicalMaterial {...PBR_MATERIALS.crystalGlass} />
            </mesh>
          </group>
        ))}
      </group>

      {/* 12. DÀN ĐÈN UPLIGHTING DƯỚI CHÂN VÒM SÂN KHẤU HẮT LÊN */}
      <group position={[0, height + 0.05, -17.8]}>
        {[-3.8, -2.0, 0, 2.0, 3.8].map((uX, uIdx) => (
          <group key={`uplight-${uIdx}`} position={[uX, 0, 0]}>
            <spotLight
              position={[0, 0.15, 0]}
              target-position={[uX * 0.7, 4.2, -18.2]}
              color="#FFE4B5"
              intensity={4.8}
              angle={Math.PI / 4}
              penumbra={0.65}
              distance={12}
            />
          </group>
        ))}
      </group>
    </group>
  );
}
