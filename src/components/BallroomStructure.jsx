import React, { useMemo } from 'react';
import * as THREE from 'three';
import { PALETTE, PBR_MATERIALS } from '../constants/colors';
import { BALLROOM_DIMENSIONS } from '../constants/layoutData';

/**
 * Cấu trúc kiến trúc sảnh tiệc 30m x 40m x 8m (Tone Sáng Sang Trọng):
 * - Không có cửa sổ kính nhìn ra ngoài trời (sảnh kín tiêu chuẩn trung tâm tiệc cưới).
 * - Tường bọc hệ rèm voan mềm mại màu trắng kem sáng (Ivory `#FAF8F5`).
 * - Sàn đá cẩm thạch sáng bóng, trần thạch cao hoa văn hoàng gia tone sáng.
 * - Bức tường ngăn tiền sảnh với 3 cụm cửa đôi mở viền vàng Champagne.
 */
export default function BallroomStructure() {
  const { width, length, height } = BALLROOM_DIMENSIONS;

  const createCurtainGeometry = (curtainWidth, curtainHeight, pleatCount = 40) => {
    const geom = new THREE.PlaneGeometry(curtainWidth, curtainHeight, pleatCount, 16);
    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const u = (pos.getX(i) / curtainWidth) * Math.PI * pleatCount * 0.5;
      pos.setZ(i, Math.sin(u) * 0.12);
    }
    geom.computeVertexNormals();
    return geom;
  };

  const northCurtainGeom = useMemo(() => createCurtainGeometry(width, height, 50), [width, height]);
  const sideCurtainGeom = useMemo(() => createCurtainGeometry(length, height, 65), [length, height]);

  return (
    <group name="BallroomStructure">
      {/* 1. SÀN ĐÁ CẨM THẠCH TRẮNG NGÀ TỰ NHIÊN */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial
          color="#E6E0D4"
          roughness={0.25}
          metalness={0.06}
        />
      </mesh>

      {/* Viền chân tường sàn (Baseboard Moulding) viền vàng đồng */}
      <mesh position={[0, 0.1, -length / 2]}>
        <boxGeometry args={[width, 0.2, 0.1]} />
        <meshStandardMaterial color={PALETTE.ivoryDark} roughness={0.3} />
      </mesh>
      <mesh position={[-width / 2, 0.1, 0]}>
        <boxGeometry args={[0.1, 0.2, length]} />
        <meshStandardMaterial color={PALETTE.ivoryDark} roughness={0.3} />
      </mesh>
      <mesh position={[width / 2, 0.1, 0]}>
        <boxGeometry args={[0.1, 0.2, length]} />
        <meshStandardMaterial color={PALETTE.ivoryDark} roughness={0.3} />
      </mesh>

      {/* 2. TRẦN NHÀ SẢNH TIỆC (CAO 8M, TONE TRẦM HOÀNG GIA LÀM NỔI BẬT ĐÈN CHÙM) */}
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, height, 0]}
      >
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial
          color="#24212B"
          roughness={0.7}
        />
      </mesh>

      {/* Hệ xà dầm kiến trúc trần trang trí sơn trắng ngà viền nẹp vàng */}
      {[-12, -4, 4, 12].map((zPos, idx) => (
        <group key={`beam-${idx}`} position={[0, height - 0.15, zPos]}>
          <mesh>
            <boxGeometry args={[width, 0.3, 0.6]} />
            <meshStandardMaterial color="#FAF8F5" roughness={0.4} />
          </mesh>
          {/* Nẹp viền vàng champagne trên dầm trần */}
          <mesh position={[0, -0.16, 0]}>
            <boxGeometry args={[width - 1, 0.04, 0.62]} />
            <meshStandardMaterial {...PBR_MATERIALS.goldMetal} />
          </mesh>
          {/* Dải đèn LED hắt khe trần màu ấm */}
          <mesh position={[0, -0.17, 0]}>
            <boxGeometry args={[width - 2, 0.02, 0.1]} />
            <meshBasicMaterial color="#FFECC9" />
          </mesh>
        </group>
      ))}

      {/* 3. CÁC BỨC TƯỜNG PHỦ RÈM VOAN TRẮNG KEM MỀM MẠI (DRAPING) */}
      {/* Rèm Tường Bắc (Phía sau sân khấu Z = -20) */}
      <mesh
        geometry={northCurtainGeom}
        position={[0, height / 2, -length / 2 + 0.15]}
      >
        <meshStandardMaterial
          color="#FAF8F5"
          roughness={0.7}
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
          color="#FAF8F5"
          roughness={0.7}
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
          color="#FAF8F5"
          roughness={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 4. BỨC TƯỜNG NGĂN GIỮA SẢNH CHÍNH & TIỀN SẢNH (Z = +20) CÓ 3 CỬA ĐÔI MỞ */}
      <group position={[0, 0, length / 2]}>
        <mesh position={[0, 6, 0]}>
          <boxGeometry args={[width, 4, 0.3]} />
          <meshStandardMaterial color="#F6F3EC" roughness={0.4} />
        </mesh>

        <mesh position={[-12.05, 2, 0]}>
          <boxGeometry args={[5.9, 4, 0.3]} />
          <meshStandardMaterial color="#F6F3EC" roughness={0.4} />
        </mesh>
        <mesh position={[-3.85, 2, 0]}>
          <boxGeometry args={[4.1, 4, 0.3]} />
          <meshStandardMaterial color="#F6F3EC" roughness={0.4} />
        </mesh>
        <mesh position={[3.85, 2, 0]}>
          <boxGeometry args={[4.1, 4, 0.3]} />
          <meshStandardMaterial color="#F6F3EC" roughness={0.4} />
        </mesh>
        <mesh position={[12.05, 2, 0]}>
          <boxGeometry args={[5.9, 4, 0.3]} />
          <meshStandardMaterial color="#F6F3EC" roughness={0.4} />
        </mesh>

        {/* 3 Cụm Cửa Đôi Mở Sang Hai Bên */}
        {[-7.5, 0, 7.5].map((doorX, dIdx) => (
          <group key={`door-arch-${dIdx}`} position={[doorX, 0, 0]}>
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

            {/* Cánh cửa bên trái */}
            <group position={[-1.6, 0, 0]} rotation={[0, -Math.PI / 2.8, 0]}>
              <mesh position={[0.75, 1.95, 0]}>
                <boxGeometry args={[1.5, 3.8, 0.08]} />
                <meshStandardMaterial color="#F4EFE6" roughness={0.3} metalness={0.1} />
              </mesh>
              <mesh position={[1.35, 1.8, 0.06]}>
                <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
                <meshStandardMaterial {...PBR_MATERIALS.goldMetal} />
              </mesh>
              <mesh position={[0.75, 1.95, 0.05]}>
                <boxGeometry args={[1.2, 3.4, 0.02]} />
                <meshStandardMaterial color={PALETTE.champagneGold} metalness={0.85} roughness={0.2} />
              </mesh>
            </group>

            {/* Cánh cửa bên phải */}
            <group position={[1.6, 0, 0]} rotation={[0, Math.PI / 2.8, 0]}>
              <mesh position={[-0.75, 1.95, 0]}>
                <boxGeometry args={[1.5, 3.8, 0.08]} />
                <meshStandardMaterial color="#F4EFE6" roughness={0.3} metalness={0.1} />
              </mesh>
              <mesh position={[-1.35, 1.8, 0.06]}>
                <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
                <meshStandardMaterial {...PBR_MATERIALS.goldMetal} />
              </mesh>
              <mesh position={[-0.75, 1.95, 0.05]}>
                <boxGeometry args={[1.2, 3.4, 0.02]} />
                <meshStandardMaterial color={PALETTE.champagneGold} metalness={0.85} roughness={0.2} />
              </mesh>
            </group>
          </group>
        ))}
      </group>
    </group>
  );
}
