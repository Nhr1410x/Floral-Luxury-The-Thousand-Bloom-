import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { PALETTE, PBR_MATERIALS } from '../constants/colors';
import { TABLES_LIST } from '../constants/layoutData';

/**
 * 46 Bàn tiệc tròn & 460 Ghế Chiavari mạ vàng Champagne:
 * - Bố trí đối xứng 2 phân khu qua lối đi trung tâm
 * - Hàng 1 (ngang mũi bán nguyệt): 3 bàn mỗi bên
 * - 5 Hàng dưới: 4 bàn mỗi bên (Tổng cộng 46 bàn)
 * - Mỗi bàn 10 ghế Chiavari, 10 bộ đĩa sứ + napkin Dusty Blue
 * - Tall Centerpiece: Bình hoa kết hợp chân nến cao ở tâm bàn
 * - Tối ưu hóa hiệu năng bằng InstancedMesh cho toàn bộ sảnh tiệc
 * - Hỗ trợ tương tác Click / Hover trực tiếp cực nhạy
 */
export default function BanquetTables({
  selectedTable,
  onSelectTable,
  lightMode = 'ceremony',
  showTableNumbers = true,
  activeFilter = 'all'
}) {
  const tablesCount = TABLES_LIST.length; // 46
  const chairsCount = tablesCount * 10;   // 460
  const platesCount = tablesCount * 10;   // 460

  // 1. Tạo Geometry cho Ghế Chiavari đặc trưng
  const chiavariGeom = useMemo(() => {
    const geoms = [];

    // Mặt đệm ngồi ghế
    const seatGeom = new THREE.CylinderGeometry(0.22, 0.21, 0.04, 16);
    seatGeom.translate(0, 0.44, 0);
    geoms.push(seatGeom);

    // 4 Chân ghế thanh mảnh
    const legRadius = 0.015;
    const legHeight = 0.44;
    const legOffsets = [
      [-0.14, -0.14],
      [0.14, -0.14],
      [-0.14, 0.14],
      [0.14, 0.14]
    ];
    legOffsets.forEach(([lx, lz]) => {
      const leg = new THREE.CylinderGeometry(legRadius, legRadius, legHeight, 8);
      leg.translate(lx, legHeight / 2, lz);
      geoms.push(leg);
    });

    // 2 Cột tựa lưng cao phía sau
    const backPostHeight = 0.48;
    [-0.14, 0.14].forEach((px) => {
      const post = new THREE.CylinderGeometry(legRadius, legRadius, backPostHeight, 8);
      post.translate(px, 0.44 + backPostHeight / 2, -0.14);
      geoms.push(post);
    });

    // Thanh ngang đỉnh tựa lưng
    const topRail = new THREE.CylinderGeometry(0.018, 0.018, 0.3, 8);
    topRail.rotateZ(Math.PI / 2);
    topRail.translate(0, 0.44 + backPostHeight, -0.14);
    geoms.push(topRail);

    // 3 Nan đứng tựa lưng (Spindles)
    [-0.07, 0, 0.07].forEach((sx) => {
      const spindle = new THREE.CylinderGeometry(0.009, 0.009, 0.38, 8);
      spindle.translate(sx, 0.44 + backPostHeight / 2 - 0.03, -0.14);
      geoms.push(spindle);
    });

    // Các thanh giằng chân ghế (rung stretchers)
    const rungFront = new THREE.CylinderGeometry(0.008, 0.008, 0.28, 8);
    rungFront.rotateZ(Math.PI / 2);
    rungFront.translate(0, 0.16, 0.14);
    geoms.push(rungFront);

    const rungBack = new THREE.CylinderGeometry(0.008, 0.008, 0.28, 8);
    rungBack.rotateZ(Math.PI / 2);
    rungBack.translate(0, 0.16, -0.14);
    geoms.push(rungBack);

    const merged = mergeGeometries(geoms, false);
    return merged;
  }, []);

  // 2. Tạo Geometry cho Khăn trải bàn Ivory rủ tròn
  const tableClothGeom = useMemo(() => {
    const geom = new THREE.CylinderGeometry(0.92, 1.02, 0.74, 32);
    geom.translate(0, 0.37, 0);
    return geom;
  }, []);

  // 3. Tạo Geometry cho Đĩa sứ trắng ngà + Khăn ăn (Napkin) Dusty Blue
  const plateAndNapkinGeom = useMemo(() => {
    const geoms = [];

    const plate = new THREE.CylinderGeometry(0.14, 0.12, 0.015, 20);
    plate.translate(0, 0.008, 0);
    geoms.push(plate);

    const smallPlate = new THREE.CylinderGeometry(0.1, 0.09, 0.012, 20);
    smallPlate.translate(0, 0.02, 0);
    geoms.push(smallPlate);

    const napkin = new THREE.BoxGeometry(0.09, 0.025, 0.13);
    napkin.translate(0, 0.032, 0);
    geoms.push(napkin);

    const glass = new THREE.CylinderGeometry(0.03, 0.015, 0.12, 12);
    glass.translate(0.14, 0.06, -0.06);
    geoms.push(glass);

    return mergeGeometries(geoms, false);
  }, []);

  // 4. Tạo Geometry cho Tall Centerpiece (Chân nến kim loại cao + vòm hoa + nến)
  const tallCenterpieceGeom = useMemo(() => {
    const geoms = [];

    const base = new THREE.CylinderGeometry(0.18, 0.22, 0.03, 20);
    base.translate(0, 0.015, 0);
    geoms.push(base);

    const stem = new THREE.CylinderGeometry(0.02, 0.03, 0.85, 16);
    stem.translate(0, 0.44, 0);
    geoms.push(stem);

    const bowl = new THREE.CylinderGeometry(0.32, 0.1, 0.12, 24);
    bowl.translate(0, 0.88, 0);
    geoms.push(bowl);

    const flowerDome = new THREE.SphereGeometry(0.38, 16, 12);
    flowerDome.scale(1, 0.7, 1);
    flowerDome.translate(0, 1.08, 0);
    geoms.push(flowerDome);

    const branchOffsets = [
      [-0.22, 0],
      [0.22, 0],
      [0, -0.22],
      [0, 0.22]
    ];
    branchOffsets.forEach(([bx, bz]) => {
      const arm = new THREE.CylinderGeometry(0.012, 0.012, 0.26, 8);
      arm.translate(bx, 1.15, bz);
      geoms.push(arm);

      const candle = new THREE.CylinderGeometry(0.018, 0.018, 0.16, 12);
      candle.translate(bx, 1.34, bz);
      geoms.push(candle);
    });

    return mergeGeometries(geoms, false);
  }, []);

  const tablesRef = useRef();
  const chairsRef = useRef();
  const platesRef = useRef();
  const centerpiecesRef = useRef();

  useEffect(() => {
    if (!tablesRef.current || !chairsRef.current || !platesRef.current || !centerpiecesRef.current) return;

    const dummy = new THREE.Object3D();
    let chairGlobalIndex = 0;
    let plateGlobalIndex = 0;

    TABLES_LIST.forEach((table, tIdx) => {
      dummy.position.set(table.x, 0, table.z);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      tablesRef.current.setMatrixAt(tIdx, dummy.matrix);

      dummy.position.set(table.x, 0.74, table.z);
      dummy.rotation.set(0, (tIdx * Math.PI) / 6, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      centerpiecesRef.current.setMatrixAt(tIdx, dummy.matrix);

      const chairRadius = 1.32;
      const plateRadius = 0.70;

      for (let s = 0; s < 10; s++) {
        const angle = (s / 10) * Math.PI * 2;

        const cx = table.x + Math.sin(angle) * chairRadius;
        const cz = table.z + Math.cos(angle) * chairRadius;
        dummy.position.set(cx, 0, cz);
        dummy.rotation.set(0, angle + Math.PI, 0);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        chairsRef.current.setMatrixAt(chairGlobalIndex++, dummy.matrix);

        const px = table.x + Math.sin(angle) * plateRadius;
        const pz = table.z + Math.cos(angle) * plateRadius;
        dummy.position.set(px, 0.74, pz);
        dummy.rotation.set(0, angle, 0);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        platesRef.current.setMatrixAt(plateGlobalIndex++, dummy.matrix);
      }
    });

    tablesRef.current.instanceMatrix.needsUpdate = true;
    chairsRef.current.instanceMatrix.needsUpdate = true;
    platesRef.current.instanceMatrix.needsUpdate = true;
    centerpiecesRef.current.instanceMatrix.needsUpdate = true;
  }, [tablesCount, chiavariGeom, tableClothGeom, plateAndNapkinGeom, tallCenterpieceGeom]);

  // Xử lý click chọn bàn từ InstancedMesh
  const handleTableClick = (e) => {
    e.stopPropagation();
    if (e.instanceId !== undefined && TABLES_LIST[e.instanceId]) {
      onSelectTable(TABLES_LIST[e.instanceId]);
    }
  };

  const handleChairClick = (e) => {
    e.stopPropagation();
    if (e.instanceId !== undefined) {
      const tableIdx = Math.floor(e.instanceId / 10);
      if (TABLES_LIST[tableIdx]) {
        onSelectTable(TABLES_LIST[tableIdx]);
      }
    }
  };

  const handlePointerOver = (e) => {
    e.stopPropagation();
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    document.body.style.cursor = 'auto';
  };

  return (
    <group name="BanquetSeatingLayout">
      {/* 1. KHĂN TRẢI BÀN (IVORY TABLECLOTHS) - 46 BÀN (CÓ THỂ CLICK CHỌN) */}
      <instancedMesh
        ref={tablesRef}
        args={[tableClothGeom, null, tablesCount]}
        receiveShadow
        castShadow
        onClick={handleTableClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <meshStandardMaterial
          color={PALETTE.ivory}
          roughness={PBR_MATERIALS.tableLinen.roughness}
          metalness={PBR_MATERIALS.tableLinen.metalness}
        />
      </instancedMesh>

      {/* 2. GHẾ CHIAVARI MẠ VÀNG CHAMPAGNE GOLD - 460 GHẾ (CÓ THỂ CLICK CHỌN) */}
      <instancedMesh
        ref={chairsRef}
        args={[chiavariGeom, null, chairsCount]}
        castShadow
        receiveShadow
        onClick={handleChairClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <meshStandardMaterial
          color={PALETTE.champagneGold}
          metalness={PBR_MATERIALS.goldMetal.metalness}
          roughness={PBR_MATERIALS.goldMetal.roughness}
        />
      </instancedMesh>

      {/* 3. BỘ ĐĨA SỨ TRẮNG & NAPKIN DUSTY BLUE & LY PHA LÊ - 460 BỘ */}
      <instancedMesh
        ref={platesRef}
        args={[plateAndNapkinGeom, null, platesCount]}
        castShadow
        raycast={() => null} // Không chặn raycast bàn
      >
        <meshStandardMaterial
          color={PALETTE.dustyBlue}
          roughness={0.5}
          metalness={0.1}
        />
      </instancedMesh>

      {/* 4. TALL CENTERPIECES (CHÂN NẾN CAO & HOA ĐA SẮC) - 46 CỤM (CÓ THỂ CLICK CHỌN) */}
      <instancedMesh
        ref={centerpiecesRef}
        args={[tallCenterpieceGeom, null, tablesCount]}
        castShadow
        onClick={handleTableClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <meshStandardMaterial
          color={PALETTE.champagneGold}
          metalness={0.7}
          roughness={0.3}
        />
      </instancedMesh>

      {/* 5. CÁC HIỆU ỨNG HIGHLIGHT & SỐ BÀN KHI BÀN ĐƯỢC CHỌN */}
      {TABLES_LIST.map((table) => {
        const isSelected = selectedTable?.id === table.id;

        return (
          <group
            key={table.id}
            position={[table.x, 0, table.z]}
            onClick={(e) => {
              e.stopPropagation();
              onSelectTable(table);
            }}
          >
            {/* Vòng tròn hiệu ứng Highlight khi được chọn */}
            {isSelected && (
              <group position={[0, 0.03, 0]}>
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[1.45, 1.65, 32]} />
                  <meshBasicMaterial color={PALETTE.champagneGold} side={THREE.DoubleSide} />
                </mesh>
                <pointLight position={[0, 3.2, 0]} color={PALETTE.candleWarm} intensity={4.0} distance={6} />
              </group>
            )}

            {/* Vòng nẹp chân bàn VIP */}
            {table.isVip && (
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
                <ringGeometry args={[0.95, 1.05, 32]} />
                <meshStandardMaterial color={PALETTE.champagneGold} metalness={0.9} roughness={0.2} />
              </mesh>
            )}

            {/* Đèn nến bàn tiệc phát sáng nhẹ nhàng */}
            <pointLight
              position={[0, 1.85, 0]}
              color={PALETTE.candleFlame}
              intensity={lightMode === 'ceremony' ? 0.75 : 0.35}
              distance={2.8}
              decay={2}
            />

            {/* Thẻ số bàn nổi */}
            {showTableNumbers && (
              <group position={[0, 1.8, 0]}>
                <mesh position={[0, 0, 0]}>
                  <boxGeometry args={[0.26, 0.16, 0.02]} />
                  <meshStandardMaterial
                    color={table.isVip ? PALETTE.champagneGold : '#FFFFFF'}
                    roughness={0.2}
                    metalness={table.isVip ? 0.8 : 0.1}
                  />
                </mesh>
              </group>
            )}
          </group>
        );
      })}
    </group>
  );
}
