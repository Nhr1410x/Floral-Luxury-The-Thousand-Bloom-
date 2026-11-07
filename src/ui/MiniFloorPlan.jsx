import React, { useState } from 'react';
import { TABLES_LIST, BALLROOM_DIMENSIONS, STAGE_CONFIG } from '../constants/layoutData';
import { PALETTE } from '../constants/colors';

/**
 * Sơ đồ Mặt bằng 2D tương tác (Tone Sáng Sang Trọng):
 * - Mô phỏng chuẩn tỷ lệ 30m x 40m
 * - Hiển thị trực quan vị trí Sân khấu, Lối đi, Cửa ra vào và 46 Bàn tiệc
 */
export default function MiniFloorPlan({
  selectedTable,
  onSelectTable,
  activePresetId,
  onSelectPreset
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [hoveredTable, setHoveredTable] = useState(null);

  const svgWidth = 220;
  const svgHeight = 320;

  const mapX = (x) => 110 + (x / 15) * 85;
  const mapZ = (z) => 90 + (z / 20) * 80;

  return (
    <div className="bg-[#FAF7F2]/95 backdrop-blur-md border border-[#D4AF37]/50 rounded-xl p-3 shadow-xl text-[#2A231C] select-none transition-all duration-300">
      <div className="flex items-center justify-between pb-2 border-b border-[#D4AF37]/25 mb-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-pulse"></span>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C6D1F]">
            Sơ đồ Mặt bằng 2D
          </h4>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[11px] text-gray-600 hover:text-black px-1.5 py-0.5 rounded bg-black/5"
        >
          {isExpanded ? 'Thu nhỏ' : 'Mở rộng'}
        </button>
      </div>

      {isExpanded && (
        <div className="relative">
          <svg
            width={svgWidth}
            height={svgHeight}
            className="bg-[#F2ECE1] rounded-lg border border-[#D4AF37]/30 mx-auto"
          >
            {/* SẢNH TIỆC CHÍNH */}
            <rect
              x={mapX(-15)}
              y={mapZ(-20)}
              width={170}
              height={mapZ(20) - mapZ(-20)}
              fill="#FAF7F2"
              stroke="#D4AF37"
              strokeWidth="1.2"
              strokeDasharray="3 3"
              rx="4"
            />

            {/* SÂN KHẤU CHÍNH */}
            <rect
              x={mapX(-7)}
              y={mapZ(-20)}
              width={mapX(7) - mapX(-7)}
              height={mapZ(-15.5) - mapZ(-20)}
              fill="#FFFFFF"
              stroke="#D4AF37"
              strokeWidth="1"
              rx="2"
            />
            <path
              d={`M ${mapX(-4.5)} ${mapZ(-15.5)} A 25.5 25.5 0 0 0 ${mapX(4.5)} ${mapZ(-15.5)} Z`}
              fill="#FFFFFF"
              stroke="#D4AF37"
              strokeWidth="1.2"
            />
            <text
              x="110"
              y={mapZ(-17.5)}
              textAnchor="middle"
              fill="#664E1B"
              fontSize="7.5"
              fontWeight="bold"
            >
              MAIN STAGE
            </text>

            {/* THẢM LỐI ĐI TRUNG TÂM */}
            <rect
              x={mapX(-1.6)}
              y={mapZ(-11)}
              width={mapX(1.6) - mapX(-1.6)}
              height={mapZ(20) - mapZ(-11)}
              fill="#FFFDF8"
              stroke="#D4AF37"
              strokeWidth="0.8"
            />
            <text
              x="110"
              y={mapZ(4)}
              textAnchor="middle"
              fill="#8C6D1F"
              fontSize="6"
              fontWeight="bold"
              transform={`rotate(90, 110, ${mapZ(4)})`}
            >
              CENTER AISLE
            </text>

            {/* TƯỜNG NGĂN CỬA CHÍNH */}
            <line
              x1={mapX(-15)}
              y1={mapZ(20)}
              x2={mapX(15)}
              y2={mapZ(20)}
              stroke="#B89B77"
              strokeWidth="2"
            />
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

            {/* TIỀN SẢNH */}
            <rect
              x={mapX(-15)}
              y={mapZ(20)}
              width={170}
              height={mapZ(29) - mapZ(20)}
              fill="#F9F5EE"
              stroke="#C4A882"
              strokeWidth="0.8"
              rx="2"
            />
            <rect
              x={mapX(-2.5)}
              y={mapZ(23.5)}
              width={mapX(2.5) - mapX(-2.5)}
              height={6}
              fill="#C4D7ED"
              stroke="#85A3C7"
              rx="2"
            />
            <text x="110" y={mapZ(23.5) + 4.5} textAnchor="middle" fill="#203E66" fontSize="5" fontWeight="bold">
              RECEPTION
            </text>

            <rect
              x={mapX(-3.5)}
              y={mapZ(27.5)}
              width={mapX(3.5) - mapX(-3.5)}
              height={4}
              fill="#FAD1DA"
              stroke="#D98A9E"
              rx="1"
            />
            <text x="110" y={mapZ(27.5) + 3} textAnchor="middle" fill="#5E2231" fontSize="4.5" fontWeight="bold">
              PHOTOBOOTH
            </text>

            {/* 46 BÀN TIỆC TRÒN */}
            {TABLES_LIST.map((table) => {
              const tx = mapX(table.x);
              const tz = mapZ(table.z);
              const isSelected = selectedTable?.id === table.id;

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
                  <circle
                    cx={tx}
                    cy={tz}
                    r={isSelected ? 6.4 : 5.2}
                    fill={isSelected ? '#D4AF37' : table.isVip ? '#F7C8D1' : '#FFFFFF'}
                    stroke={isSelected ? '#664E1B' : table.isVip ? '#D4AF37' : '#B8CDDF'}
                    strokeWidth={isSelected ? 1.8 : 0.9}
                  />
                  <text
                    x={tx}
                    y={tz + 2}
                    textAnchor="middle"
                    fill={isSelected ? '#FFFFFF' : '#222222'}
                    fontSize="4.3"
                    fontWeight="bold"
                  >
                    {table.number}
                  </text>
                </g>
              );
            })}
          </svg>

          {hoveredTable && (
            <div className="absolute top-1 left-1 bg-white/95 text-[#2A231C] text-[10px] p-2 rounded-lg border border-[#D4AF37] shadow-lg pointer-events-none">
              <span className="font-bold text-[#8C6D1F]">Bàn #{hoveredTable.number}</span>
              <div className="text-gray-700 font-medium">{hoveredTable.category}</div>
              <div className="text-[9px] text-gray-500">10 Khách • {hoveredTable.wing}</div>
            </div>
          )}

          <div className="flex items-center justify-between text-[10px] text-gray-700 font-medium mt-2 px-1">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#F7C8D1] border border-[#D4AF37]"></span>
              VIP (6 bàn)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-white border border-[#B8CDDF]"></span>
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
