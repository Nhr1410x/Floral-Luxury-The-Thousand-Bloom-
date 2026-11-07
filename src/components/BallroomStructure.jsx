import React, { useMemo } from 'react';
import * as THREE from 'three';
import { PALETTE, PBR_MATERIALS } from '../constants/colors';
import { BALLROOM_DIMENSIONS } from '../constants/layoutData';

/**
 * Cấu trúc kiến trúc sảnh tiệc 30m x 40m x 8m:
 * - Không có cửa sổ kính nhìn ra ngoài trời (sảnh kín).
 * - Tường bọc hệ rèm voan mềm mại (pleated sheer voile draping) che hành lang phục vụ/cánh gà.
 * - Sàn đá cẩm thạch sáng bóng nhẹ.
 * - Bức tường ngăn tiền sảnh với 3 cụm cửa đôi mở.
 */
export default function BallroomStructure() {
  const { width, length, height } = BALLROOM_DIMENSIONS;

  // Tạo geometry nếp gấp rèm voan (curtain draping with sinusoidal pleats)
  const createCurtainGeometry = (curtainWidth, curtainHeight, pleatCount = 40) => {
    const geom = new THREE.PlaneGeometry(curtainWidth, curtainHeight, pleatCount, 16);
    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const u = (pos.getX(i) / curtainWidth) * Math.PI * pleatCount * 0.5;
      // Độ sâu nếp gấp dập dềnh
      pos.setZ(i, Math.sin(u) * 0.12);
    }
    geom.computeVertexNormals();
    return geom;
  };

  const northCurtainGeom = useMemo(() => createCurtainGeometry(width, height, 50), [width, height]);
  const sideCurtainGeom = useMemo(() => createCurtainGeometry(length, height, 65), [length, height]);

  return (
    <group name="BallroomStructure">
      {/* 1. SÀN ĐÁ CẨM THẠCH TRONG SẢNH TIỆC (Z: -20 to +20, X: -15 to +15) */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial
          color={PALETTE.floorMarble}
          roughness={PBR_MATERIALS.marbleFloor.roughness}
          metalness={PBR_MATERIALS.marbleFloor.metalness}
        />
      </mesh>

      {/* Viền chân tường sàn (Baseboard Moulding) */}
      <mesh position={[0, 0.1, -length / 2]}>
        <boxGeometry args={[width, 0.2, 0.1]} />
        <meshStandardMaterial color={PALETTE.ivoryDark} roughness={0.4} />
      </mesh>
      <mesh position={[-width / 2, 0.1, 0]}>
        <boxGeometry args={[0.1, 0.2, length]} />
        <meshStandardMaterial color={PALETTE.ivoryDark} roughness={0.4} />
      </mesh>
      <mesh position={[width / 2, 0.1, 0]}>
        <boxGeometry args={[0.1, 0.2, length]} />
        <meshStandardMaterial color={PALETTE.ivoryDark} roughness={0.4} />
      </mesh>

      {/* 2. TRẦN NHÀ SẢNH TIỆC (Cao 8m) */}
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, height, 0]}
      >
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial
          color="#3A3835" // Trần kỹ thuật tối màu nhẹ để tôn vinh đèn chùm & fairy lights
          roughness={0.9}
        />
      </mesh>

      {/* Hệ xà dầm kiến trúc trần (Ceiling Beams for chandeliers and lighting rigs) */}
      {[-12, -4, 4, 12].map((zPos, idx) => (
        <group key={`beam-${idx}`} position={[0, height - 0.2, zPos]}>
          <mesh>
            <boxGeometry args={[width, 0.35, 0.6]} />
            <meshStandardMaterial color="#2B2927" roughness={0.7} />
          </mesh>
          {/* Dải đèn LED hắt khe trần màu ấm */}
          <mesh position={[0, -0.18, 0]}>
            <boxGeometry args={[width - 2, 0.04, 0.1]} />
            <meshBasicMaterial color={PALETTE.candleWarm} />
          </mesh>
        </group>
      ))}

      {/* 3. CÁC BỨC TƯỜNG PHỦ RÈM VOAN MỀM MẠI (DRAPING) */}
      {/* Rèm Tường Bắc (Phía sau sân khấu, che khu vực hậu trường Z = -20) */}
      <mesh
        geometry={northCurtainGeom}
        position={[0, height / 2, -length / 2 + 0.15]}
      >
        <meshStandardMaterial
          color={PALETTE.ivory}
          roughness={PBR_MATERIALS.sheerVoile.roughness}
          metalness={PBR_MATERIALS.sheerVoile.metalness}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Rèm Tường Tây (Bên Trái X = -15) */}
      <mesh
        geometry={sideCurtainGeom}
        rotation={[0, Math.PI / 2, 0]}
        position={[-width / 2 + 0.15, height / 2, 0]}
      >
        <meshStandardMaterial
          color={PALETTE.ivory}
          roughness={PBR_MATERIALS.sheerVoile.roughness}
          metalness={PBR_MATERIALS.sheerVoile.metalness}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Rèm Tường Đông (Bên Phải X = +15) */}
      <mesh
        geometry={sideCurtainGeom}
        rotation={[0, -Math.PI / 2, 0]}
        position={[width / 2 - 0.15, height / 2, 0]}
      >
        <meshStandardMaterial
          color={PALETTE.ivory}
          roughness={PBR_MATERIALS.sheerVoile.roughness}
          metalness={PBR_MATERIALS.sheerVoile.metalness}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 4. BỨC TƯỜNG NGĂN GIỮA SẢNH CHÍNH & TIỀN SẢNH (Z = +20) CÓ 3 CỬA ĐÔI MỞ */}
      <group position={[0, 0, length / 2]}>
        {/* Tường ngăn chính (phần trên và các mảng tường đặc) */}
        {/* Mảng tường trên cao (trên cửa từ 4m đến 8m) */}
        <mesh position={[0, 6, 0]}>
          <boxGeometry args={[width, 4, 0.3]} />
          <meshStandardMaterial color={PALETTE.ivoryDark} roughness={0.6} />
        </mesh>

        {/* Các mảng tường dọc xen kẽ giữa 3 cửa đôi */}
        {/* Cửa giữa: X = 0 (rộng 3.6m, cao 4m) */}
        {/* Cửa trái: X = -7.5 (rộng 3.2m, cao 4m) */}
        {/* Cửa phải: X = +7.5 (rộng 3.2m, cao 4m) */}
        {/* Tường bên trái cùng: X từ -15 đến -9.1 (rộng 5.9m) */}
        <mesh position={[-12.05, 2, 0]}>
          <boxGeometry args={[5.9, 4, 0.3]} />
          <meshStandardMaterial color={PALETTE.ivoryDark} roughness={0.6} />
        </mesh>
        {/* Tường giữa cửa trái & cửa giữa: X từ -5.9 đến -1.8 (rộng 4.1m) */}
        <mesh position={[-3.85, 2, 0]}>
          <boxGeometry args={[4.1, 4, 0.3]} />
          <meshStandardMaterial color={PALETTE.ivoryDark} roughness={0.6} />
        </mesh>
        {/* Tường giữa cửa giữa & cửa phải: X từ +1.8 đến +5.9 (rộng 4.1m) */}
        <mesh position={[3.85, 2, 0]}>
          <boxGeometry args={[4.1, 4, 0.3]} />
          <meshStandardMaterial color={PALETTE.ivoryDark} roughness={0.6} />
        </mesh>
        {/* Tường bên phải cùng: X từ +9.1 đến +15 (rộng 5.9m) */}
        <mesh position={[12.05, 2, 0]}>
          <boxGeometry args={[5.9, 4, 0.3]} />
          <meshStandardMaterial color={PALETTE.ivoryDark} roughness={0.6} />
        </mesh>

        {/* 3 Cụm Cửa Đôi Mở Sang Hai Bên (Triple Double Doors with Gold Trim) */}
        {[-7.5, 0, 7.5].map((doorX, dIdx) => (
          <group key={`door-arch-${dIdx}`} position={[doorX, 0, 0]}>
            {/* Khung vòm cửa sang trọng viền vàng champagne */}
            <mesh position={[0, 4.05, 0]}>
              <boxGeometry args={[3.4, 0.15, 0.36]} />
              <meshStandardMaterial {...PBR_MATERIALS.goldMetal} />
            </mesh>
            <mesh position={[-1.7, 2, 0]}>
              <boxGeometry args={[0.15, 4, 0.36]} />
              <meshStandardMaterial {...PBR_MATERIALS.goldMetal} />
            </mesh>
            <mesh position={[1.7, 2, 0]}>
              <boxGeometry args={[0.15, 4, 0.36]} />
              <meshStandardMaterial {...PBR_MATERIALS.goldMetal} />
            </mesh>

            {/* Cánh cửa bên trái mở góc 65 độ */}
            <group position={[-1.6, 0, 0]} rotation={[0, -Math.PI / 2.8, 0]}>
              <mesh position={[0.75, 1.95, 0]}>
                <boxGeometry args={[1.5, 3.8, 0.08]} />
                <meshStandardMaterial color="#4A3B32" roughness={0.3} metalness={0.1} />
              </mesh>
              {/* Tay nắm cửa vàng */}
              <mesh position={[1.35, 1.8, 0.06]}>
                <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
                <meshStandardMaterial {...PBR_MATERIALS.goldMetal} />
              </mesh>
              {/* Phù điêu viền ô cửa */}
              <mesh position={[0.75, 1.95, 0.05]}>
                <boxGeometry args={[1.2, 3.4, 0.02]} />
                <meshStandardMaterial color={PALETTE.champagneGold} metalness={0.8} roughness={0.3} />
              </mesh>
            </group>

            {/* Cánh cửa bên phải mở góc 65 độ */}
            <group position={[1.6, 0, 0]} rotation={[0, Math.PI / 2.8, 0]}>
              <mesh position={[-0.75, 1.95, 0]}>
                <boxGeometry args={[1.5, 3.8, 0.08]} />
                <meshStandardMaterial color="#4A3B32" roughness={0.3} metalness={0.1} />
              </mesh>
              {/* Tay nắm cửa vàng */}
              <mesh position={[-1.35, 1.8, 0.06]}>
                <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
                <meshStandardMaterial {...PBR_MATERIALS.goldMetal} />
              </mesh>
              <mesh position={[-0.75, 1.95, 0.05]}>
                <boxGeometry args={[1.2, 3.4, 0.02]} />
                <meshStandardMaterial color={PALETTE.champagneGold} metalness={0.8} roughness={0.3} />
              </mesh>
            </group>
          </group>
        ))}
      </group>
    </group>
  );
}

