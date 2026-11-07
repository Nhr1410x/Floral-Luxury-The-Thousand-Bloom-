import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import { PALETTE, PBR_MATERIALS } from '../constants/colors';
import { BALLROOM_DIMENSIONS } from '../constants/layoutData';

/**
 * Khu vực Tiền sảnh (Reception & Check-in Area):
 * - Nằm bên ngoài tường ngăn chính (Z từ +20m đến +30m, rộng 30m, cao 5m)
 * - Bàn tiếp tân (Reception Desk) ở trung tâm (Z ≈ +24m)
 * - Khu vực Backdrop Check-in / Photobooth chụp hình (Z ≈ +28m)
 * - Đồng bộ ngôn ngữ hoa Floral Luxury "The Thousand Bloom"
 */
export default function ReceptionArea() {
  const { width, foyerLength } = BALLROOM_DIMENSIONS;
  const foyerCenterZ = 20 + foyerLength / 2; // Z = 25m
  const foyerHeight = 5.2;

  // Tạo hoa trang trí cho bàn Reception và Backdrop
  const backdropFlowers = useMemo(() => {
    const items = [];
    const colors = [PALETTE.dustyBlue, PALETTE.blushPink, PALETTE.ivory, PALETTE.sageGreen];
    // Vòm hoa lượn sóng trên backdrop check-in
    for (let i = 0; i < 35; i++) {
      const angle = (i / 35) * Math.PI;
      const x = -Math.cos(angle) * 2.8 + (Math.random() - 0.5) * 0.25;
      const y = Math.sin(angle) * 1.6 + 2.5 + (Math.random() - 0.5) * 0.25;
      const z = 28.2 + (Math.random() - 0.5) * 0.2;
      items.push({
        id: `bd-fl-${i}`,
        pos: [x, y, z],
        scale: 0.18 + Math.random() * 0.14,
        color: colors[Math.floor(Math.random() * colors.length)],
        isLeaf: Math.random() > 0.65
      });
    }
    return items;
  }, []);

  return (
    <group name="ReceptionArea">
      {/* 1. SÀN TIỀN SẢNH (FOYER MARBLE FLOOR) */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, foyerCenterZ]}
        receiveShadow
      >
        <planeGeometry args={[width, foyerLength]} />
        <meshStandardMaterial
          color={PALETTE.floorMarble}
          roughness={PBR_MATERIALS.marbleFloor.roughness}
          metalness={PBR_MATERIALS.marbleFloor.metalness}
        />
      </mesh>

      {/* 2. TRẦN TIỀN SẢNH (FOYER CEILING) */}
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, foyerHeight, foyerCenterZ]}
      >
        <planeGeometry args={[width, foyerLength]} />
        <meshStandardMaterial color={PALETTE.ivoryDark} roughness={0.8} />
      </mesh>

      {/* 3. BỨC TƯỜNG PHÍA SAU TIỀN SẢNH (Z = +30) & HAI BÊN (X = ±15) */}
      {/* Tường Hậu tiền sảnh */}
      <mesh position={[0, foyerHeight / 2, 20 + foyerLength]}>
        <boxGeometry args={[width, foyerHeight, 0.2]} />
        <meshStandardMaterial color={PALETTE.ivory} roughness={0.7} />
      </mesh>

      {/* Tường cánh Trái (khu phòng chờ Cô Dâu) */}
      <mesh position={[-width / 2, foyerHeight / 2, foyerCenterZ]}>
        <boxGeometry args={[0.2, foyerHeight, foyerLength]} />
        <meshStandardMaterial color={PALETTE.ivoryDark} roughness={0.7} />
      </mesh>
      {/* Cửa phòng Cô Dâu bên trái */}
      <group position={[-width / 2 + 0.15, 0, 23.5]}>
        <mesh position={[0, 1.5, 0]}>
          <boxGeometry args={[0.05, 3.0, 1.4]} />
          <meshStandardMaterial color="#4A3B32" roughness={0.3} />
        </mesh>
        <Text
          position={[0.06, 3.2, 0]}
          rotation={[0, Math.PI / 2, 0]}
          fontSize={0.16}
          color={PALETTE.champagneGold}
        >
          PHÒNG CÔ DÂU (BRIDE ROOM)
        </Text>
      </group>

      {/* Tường cánh Phải */}
      <mesh position={[width / 2, foyerHeight / 2, foyerCenterZ]}>
        <boxGeometry args={[0.2, foyerHeight, foyerLength]} />
        <meshStandardMaterial color={PALETTE.ivoryDark} roughness={0.7} />
      </mesh>

      {/* 4. BÀN ĐÓN TIẾP (RECEPTION DESK) Ở CHÍNH GIỮA (Z = +24) */}
      <group position={[0, 0, 24]}>
        {/* Thân bàn tiếp tân dài 4.2m hình vòm bo tròn sang trọng */}
        <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.2, 1.0, 1.0]} />
          <meshStandardMaterial color={PALETTE.ivory} roughness={0.4} />
        </mesh>

        {/* Nẹp viền kim loại mạ vàng mặt trước bàn */}
        <mesh position={[0, 0.5, 0.51]}>
          <boxGeometry args={[3.8, 0.8, 0.02]} />
          <meshStandardMaterial color={PALETTE.champagneGold} metalness={0.85} roughness={0.2} />
        </mesh>

        {/* Chữ vàng trên thân bàn: "RECEPTION" */}
        <Text
          position={[0, 0.5, 0.53]}
          fontSize={0.22}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.1}
        >
          WELCOME GUESTS
        </Text>

        {/* Khay hoa tươi dài trải dọc mép bàn tiếp tân */}
        <mesh position={[0, 1.04, 0.35]}>
          <boxGeometry args={[3.6, 0.12, 0.25]} />
          <meshStandardMaterial color={PALETTE.dustyBlue} roughness={0.65} />
        </mesh>

        {/* Hộp kính mừng cưới (Glass Wishing Well / Money Box) mạ vàng */}
        <group position={[-1.2, 1.02, 0]}>
          <mesh position={[0, 0.16, 0]}>
            <boxGeometry args={[0.42, 0.32, 0.32]} />
            <meshPhysicalMaterial {...PBR_MATERIALS.crystalGlass} />
          </mesh>
          {/* Viền kim loại mạ vàng */}
          <mesh position={[0, 0.16, 0]}>
            <boxGeometry args={[0.43, 0.02, 0.33]} />
            <meshStandardMaterial {...PBR_MATERIALS.goldMetal} />
          </mesh>
        </group>

        {/* Sổ ký tên lưu niệm & Khung ảnh cưới Gallery */}
        <mesh position={[0, 1.02, -0.05]} rotation={[-Math.PI / 10, 0, 0]}>
          <boxGeometry args={[0.45, 0.04, 0.32]} />
          <meshStandardMaterial color={PALETTE.blushPinkSoft} roughness={0.5} />
        </mesh>

        {/* 2 Chân nến đồng thanh mảnh đón tiếp */}
        {[-1.7, 1.7].map((cx, cIdx) => (
          <group key={`rec-cand-${cIdx}`} position={[cx, 1.0, 0]}>
            <mesh position={[0, 0.2, 0]}>
              <cylinderGeometry args={[0.015, 0.04, 0.4, 12]} />
              <meshStandardMaterial {...PBR_MATERIALS.goldMetal} />
            </mesh>
            <pointLight position={[0, 0.45, 0]} color={PALETTE.candleWarm} intensity={0.8} distance={2.5} />
          </group>
        ))}
      </group>

      {/* 5. KHU VỰC BACKDROP CHECK-IN / PHOTOBOOTH CHỤP HÌNH (Z = +28) */}
      <group position={[0, 0, 28.2]}>
        {/* Tấm phông vòm Backdrop màu kem Ivory */}
        <mesh position={[0, 2.2, 0]} receiveShadow>
          <boxGeometry args={[5.8, 4.4, 0.1]} />
          <meshStandardMaterial color={PALETTE.ivory} roughness={0.3} />
        </mesh>

        {/* Khung viền vòm đôi mạ vàng Champagne Gold */}
        <mesh position={[0, 2.2, 0.06]}>
          <boxGeometry args={[5.5, 4.1, 0.03]} />
          <meshStandardMaterial {...PBR_MATERIALS.goldMetal} />
        </mesh>

        {/* Chữ ánh kim trên Backdrop: "Ngàn hoa, một hành trình" */}
        <Text
          position={[0, 3.4, 0.09]}
          fontSize={0.38}
          color={PALETTE.champagneGold}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.06}
        >
          The Thousand Bloom
          <meshStandardMaterial {...PBR_MATERIALS.goldMetal} />
        </Text>
        <Text
          position={[0, 2.9, 0.09]}
          fontSize={0.2}
          color={PALETTE.dustyBlueDark}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.12}
        >
          NGÀN HOA, MỘT HÀNH TRÌNH
        </Text>

        {/* Hoa tươi nở rộ trên khung Backdrop Photobooth */}
        {backdropFlowers.map((fl) => (
          <mesh key={fl.id} position={fl.pos} scale={fl.scale} castShadow>
            <dodecahedronGeometry args={[0.3, 1]} />
            <meshStandardMaterial color={fl.color} roughness={0.65} />
          </mesh>
        ))}

        {/* Thảm chụp hình nhung tròn màu kem dưới chân Backdrop */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.018, 1.2]} receiveShadow>
          <circleGeometry args={[2.2, 32]} />
          <meshStandardMaterial color={PALETTE.ivorySoft} roughness={0.9} />
        </mesh>

        {/* Hai trụ hoa đón chào hai bên góc chụp hình */}
        {[-2.6, 2.6].map((tx, tIdx) => (
          <group key={`photo-urn-${tIdx}`} position={[tx, 0, 1.0]}>
            <mesh position={[0, 0.45, 0]}>
              <cylinderGeometry args={[0.25, 0.32, 0.9, 16]} />
              <meshStandardMaterial {...PBR_MATERIALS.goldMetal} />
            </mesh>
            <mesh position={[0, 1.1, 0]}>
              <sphereGeometry args={[0.42, 16, 16]} />
              <meshStandardMaterial color={PALETTE.blushPink} roughness={0.7} />
            </mesh>
            <pointLight position={[0, 1.6, 0]} color={PALETTE.candleWarm} intensity={1.0} distance={3} />
          </group>
        ))}
      </group>

      {/* Đèn chùm pha lê khu tiền sảnh */}
      <group position={[0, foyerHeight - 0.9, 25]}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.6, 0.2, 0.8, 16]} />
          <meshPhysicalMaterial {...PBR_MATERIALS.crystalGlass} />
        </mesh>
        <pointLight position={[0, -0.3, 0]} color={PALETTE.candleWarm} intensity={2.0} distance={8} />
      </group>
    </group>
  );
}

