import React, { useState } from 'react';
import { TABLES_LIST, BALLROOM_DIMENSIONS, STAGE_CONFIG } from '../constants/layoutData';
import { PALETTE } from '../constants/colors';

/**
 * Sơ đồ Mặt bằng 2D tương tác (Mini Floor Plan Radar):
 * - Mô phỏng chuẩn tỷ lệ 30m x 40m
 * - Hiển thị trực quan vị trí Sân khấu, Lối đi, Cửa ra vào và 46 Bàn tiệc
 * - Cho phép bấm trực tiếp vào từng bàn trên sơ đồ 2D để tương tác với không gian 3D
 */
export default function MiniFloorPlan({
  selectedTable,
  onSelectTable,
  activePresetId,
  onSelectPreset
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [hoveredTable, setHoveredTable] = useState(null);

  // Kích thước SVG vẽ sơ đồ
  const svgWidth = 220;
  const svgHeight = 320;

  // Scale map: Chiều rộng 30m -> map sang svgWidth (có padding)
  // X: [-15, +15] -> [20, 200]
  // Z: [-20 (North stage), +30 (Foyer)] -> [20, 300]
  const mapX = (x) => 110 + (x / 15) * 85;
  const mapZ = (z) => 90 + (z / 20) * 80;

  return (
    <div className="bg-[#18161D]/90 backdrop-blur-md border border-[#D4AF37]/30 rounded-xl p-3 shadow-2xl text-white select-none transition-all duration-300">
      <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-pulse"></span>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">
            Sơ đồ Mặt bằng 2D
          </h4>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[11px] text-gray-400 hover:text-white px-1.5 py-0.5 rounded bg-white/5"
        >
          {isExpanded ? 'Thu nhỏ' : 'Mở rộng'}
        </button>
      </div>

      {isExpanded && (
        <div className="relative">
          <svg
            width={svgWidth}
            height={svgHeight}
            className="bg-[#0F0E13] rounded-lg border border-white/5 mx-auto"
          >
            {/* 1. KHUNG SẢNH TIỆC CHÍNH (30m x 40m: Z = -20 đến +20) */}
            <rect
              x={mapX(-15)}
              y={mapZ(-20)}
              width={170}
              height={mapZ(20) - mapZ(-20)}
              fill="#141318"
              stroke="#D4AF37"
              strokeWidth="1.2"
              strokeDasharray="3 3"
              rx="4"
            />

            {/* 2. SÂN KHẤU CHÍNH (NORTH STAGE) */}
            {/* Khối chữ nhật */}
            <rect
              x={mapX(-7)}
              y={mapZ(-20)}
              width={mapX(7) - mapX(-7)}
              height={mapZ(-15.5) - mapZ(-20)}
              fill="#F8F6F0"
              stroke="#D4AF37"
              strokeWidth="1"
              rx="2"
            />
            {/* Mũi bán nguyệt sân khấu */}
            <path
              d={`M ${mapX(-4.5)} ${mapZ(-15.5)} A 25.5 25.5 0 0 0 ${mapX(4.5)} ${mapZ(-15.5)} Z`}
              fill="#F8F6F0"
              stroke="#D4AF37"
              strokeWidth="1"
            />
            <text
              x="110"
              y={mapZ(-17.5)}
              textAnchor="middle"
              fill="#5A4634"
              fontSize="7.5"
              fontWeight="bold"
            >
              MAIN STAGE
            </text>

            {/* 3. THẢM LỐI ĐI TRUNG TÂM (CENTER AISLE) */}
            <rect
              x={mapX(-1.6)}
              y={mapZ(-11)}
              width={mapX(1.6) - mapX(-1.6)}
              height={mapZ(20) - mapZ(-11)}
              fill="#F8F6F0"
              stroke="#D4AF37"
              strokeWidth="0.8"
            />
            <text
              x="110"
              y={mapZ(4)}
              textAnchor="middle"
              fill="#A38020"
              fontSize="6"
              transform={`rotate(90, 110, ${mapZ(4)})`}
            >
              CENTER AISLE
            </text>

            {/* 4. TƯỜNG NGĂN CỬA CHÍNH (Z = +20) & 3 CỬA ĐÔI */}
            <line
              x1={mapX(-15)}
              y1={mapZ(20)}
              x2={mapX(15)}
              y2={mapZ(20)}
              stroke="#857564"
              strokeWidth="2"
            />
            {/* 3 Cụm cửa */}
            {[-7.5, 0, 7.5].map((cx, i) => (
              <rect
                key={`door-icon-${i}`}
                x={mapX(cx) - 8}
                y={mapZ(20) - 2}
                width={16}
                height={4}
                fill="#D4AF37"
              />
            ))}

            {/* 5. TIỀN SẢNH (RECEPTION AREA: Z = +20 đến +30) */}
            <rect
              x={mapX(-15)}
              y={mapZ(20)}
              width={170}
              height={mapZ(29) - mapZ(20)}
              fill="#181720"
              stroke="#666"
              strokeWidth="0.8"
              rx="2"
            />
            {/* Bàn Reception */}
            <rect
              x={mapX(-2.5)}
              y={mapZ(23.5)}
              width={mapX(2.5) - mapX(-2.5)}
              height={6}
              fill="#A7BBD6"
              rx="2"
            />
            <text x="110" y={mapZ(23.5) + 4.5} textAnchor="middle" fill="#111" fontSize="5" fontWeight="bold">
              RECEPTION
            </text>

            {/* Backdrop Check-in */}
            <rect
              x={mapX(-3.5)}
              y={mapZ(27.5)}
              width={mapX(3.5) - mapX(-3.5)}
              height={4}
              fill="#F7C8D1"
              rx="1"
            />
            <text x="110" y={mapZ(27.5) + 3} textAnchor="middle" fill="#333" fontSize="4.5">
              PHOTOBOOTH
            </text>

            {/* 6. 46 BÀN TIỆC TRÒN */}
            {TABLES_LIST.map((table) => {
              const tx = mapX(table.x);
              const tz = mapZ(table.z);
              const isSelected = selectedTable?.id === table.id;
              const isHovered = hoveredTable?.id === table.id;

              return (
                <g
                  key={table.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTable(table);
                  }}
                  onMouseEnter={() => setHoveredTable(table)}
                  onMouseLeave={() => setHoveredTable(null)}
                  className="cursor-pointer group"
                >
                  {/* Ghế 10 chỗ chấm nhỏ quanh bàn */}
                  <circle
                    cx={tx}
                    cy={tz}
                    r={isSelected ? 6.2 : 5.0}
                    fill={isSelected ? '#D4AF37' : table.isVip ? '#F7C8D1' : '#F8F6F0'}
                    stroke={isSelected ? '#FFF' : table.isVip ? '#D4AF37' : '#A7BBD6'}
                    strokeWidth={isSelected ? 1.5 : 0.8}
                  />
                  {/* Số bàn */}
                  <text
                    x={tx}
                    y={tz + 2}
                    textAnchor="middle"
                    fill={isSelected ? '#000' : '#222'}
                    fontSize="4.2"
                    fontWeight="bold"
                  >
                    {table.number}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Tooltip khi rê chuột vào bàn */}
          {hoveredTable && (
            <div className="absolute top-1 left-1 bg-black/90 text-white text-[10px] p-1.5 rounded border border-[#D4AF37]/50 pointer-events-none">
              <span className="font-bold text-[#D4AF37]">Bàn #{hoveredTable.number}</span>
              <div className="text-gray-300">{hoveredTable.category}</div>
              <div className="text-[9px] text-gray-400">10 Khách • {hoveredTable.wing}</div>
            </div>
          )}

          {/* Chú thích màu sắc */}
          <div className="flex items-center justify-between text-[10px] text-gray-300 mt-2 px-1">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#F7C8D1] border border-[#D4AF37]"></span>
              VIP (6 bàn)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#F8F6F0] border border-[#A7BBD6]"></span>
              Tiêu chuẩn (40 bàn)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37]"></span>
              Đang chọn
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

