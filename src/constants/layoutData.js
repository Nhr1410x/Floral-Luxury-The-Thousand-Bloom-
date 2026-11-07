/**
 * Thông số kiến trúc & sơ đồ mặt bằng sảnh tiệc 30m x 40m x 8m
 * Khớp chính xác với cấu trúc Floor Plan 2D & Moodboard
 */

export const BALLROOM_DIMENSIONS = {
  width: 30,    // Trục X (-15m đến +15m)
  length: 40,   // Trục Z (-20m đến +20m)
  height: 8,    // Trục Y (0 đến 8m)
  foyerLength: 10 // Khu sảnh đón khách (+20m đến +30m)
};

export const STAGE_CONFIG = {
  rectWidth: 14,
  rectDepth: 4.5,
  rectZ: -17.75, // Tâm khối chữ nhật (từ -20m đến -15.5m)
  semiRadius: 4.5,
  semiCenterZ: -15.5, // Mũi bán nguyệt nhô ra đến Z = -11.0m
  height: 0.75,
  stepCount: 3,
  stepWidth: 3.2
};

export const AISLE_CONFIG = {
  width: 3.2,
  startZ: 20.0,
  endZ: -11.0,
  flowerRunnerWidth: 0.55
};

// Sinh danh sách tọa độ chính xác cho 46 bàn tròn (23 bên Trái, 23 bên Phải)
export const generateTables = () => {
  const tables = [];
  let tableIdCounter = 1;

  // Hàng 1 (Hàng trên cùng, ngang mũi bán nguyệt sân khấu, Z = -11.2) - 3 bàn mỗi bên
  const row1Z = -11.2;
  const row1XPositions = [5.0, 8.6, 12.2];

  // Bên Trái (Left Wing - VIP Nhà Gái / Cô Dâu)
  row1XPositions.forEach((x, idx) => {
    tables.push({
      id: `L-R1-${idx + 1}`,
      number: tableIdCounter++,
      wing: 'Trái (Nhà Gái)',
      category: idx === 0 ? 'VIP 01 (Gia đình Cô Dâu)' : `Bàn VIP Thân Thiết L${idx + 1}`,
      x: -x,
      z: row1Z,
      row: 1,
      col: idx + 1,
      seats: 10,
      radius: 0.9,
      isVip: true
    });
  });

  // Bên Phải (Right Wing - VIP Nhà Trai / Chú Rể)
  row1XPositions.forEach((x, idx) => {
    tables.push({
      id: `R-R1-${idx + 1}`,
      number: tableIdCounter++,
      wing: 'Phải (Nhà Trai)',
      category: idx === 0 ? 'VIP 02 (Gia đình Chú Rể)' : `Bàn VIP Thân Thiết R${idx + 1}`,
      x: x,
      z: row1Z,
      row: 1,
      col: idx + 1,
      seats: 10,
      radius: 0.9,
      isVip: true
    });
  });

  // 5 Hàng dưới (Rows 2, 3, 4, 5, 6) - mỗi hàng 4 bàn mỗi bên
  const subRowsZ = [-5.8, -0.4, 5.0, 10.4, 15.8];
  const standardX = [3.8, 6.8, 9.8, 12.8];

  subRowsZ.forEach((zPos, rowIdx) => {
    const actualRow = rowIdx + 2;

    // Bên Trái (4 bàn)
    standardX.forEach((xPos, colIdx) => {
      tables.push({
        id: `L-R${actualRow}-${colIdx + 1}`,
        number: tableIdCounter++,
        wing: 'Trái (Nhà Gái)',
        category: actualRow <= 3 ? 'Bạn bè & Người thân' : 'Đồng nghiệp & Khách quý',
        x: -xPos,
        z: zPos,
        row: actualRow,
        col: colIdx + 1,
        seats: 10,
        radius: 0.9,
        isVip: false
      });
    });

    // Bên Phải (4 bàn)
    standardX.forEach((xPos, colIdx) => {
      tables.push({
        id: `R-R${actualRow}-${colIdx + 1}`,
        number: tableIdCounter++,
        wing: 'Phải (Nhà Trai)',
        category: actualRow <= 3 ? 'Bạn bè & Người thân' : 'Đồng nghiệp & Khách quý',
        x: xPos,
        z: zPos,
        row: actualRow,
        col: colIdx + 1,
        seats: 10,
        radius: 0.9,
        isVip: false
      });
    });
  });

  return tables;
};

export const TABLES_LIST = generateTables();

