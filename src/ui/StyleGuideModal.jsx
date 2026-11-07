import React from 'react';
import { X, Palette, BookOpen, Layers, Award } from 'lucide-react';
import { PALETTE } from '../constants/colors';

export default function StyleGuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const colorItems = [
    {
      name: 'Trắng kem (Ivory)',
      hex: '#F8F6F0',
      desc: 'Khăn trải bàn, thảm lối đi, rèm voan tường mềm mại, bậc thang sân khấu',
      textColor: '#000000'
    },
    {
      name: 'Xanh dương pastel (Dusty Blue)',
      hex: '#A7BBD6',
      desc: 'Khăn ăn (napkin) trên bàn tiệc, cụm hoa cẩm tú cầu chủ đạo',
      textColor: '#000000'
    },
    {
      name: 'Hồng phấn (Blush Pink)',
      hex: '#F7C8D1',
      desc: 'Hoa hồng trang trí đan xen trên vòm và lối đi',
      textColor: '#000000'
    },
    {
      name: 'Xanh lá tự nhiên (Sage Green)',
      hex: '#A7B89F',
      desc: 'Lá bạc Eucalyptus, cành rủ điểm xuyết quanh vòm hoa và trần',
      textColor: '#000000'
    },
    {
      name: 'Vàng ánh kim (Champagne Gold)',
      hex: '#D4AF37',
      desc: 'Khung ghế Chiavari, chân nến cao, khung vòm sân khấu (metalness: 0.85)',
      textColor: '#000000'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#15131C] border border-[#D4AF37]/50 rounded-2xl max-w-2xl w-full p-6 shadow-2xl text-white max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30">
              <Award size={22} />
            </div>
            <div>
              <h2 className="text-xl font-serif text-[#F8F6F0]">
                The Thousand Bloom
              </h2>
              <p className="text-xs text-[#D4AF37] tracking-wider uppercase">
                Ngàn hoa, một hành trình • Moodboard & Thiết Kế Concept
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Bảng màu HEX chuẩn PBR */}
        <div className="mt-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-300 flex items-center gap-1.5 mb-3">
            <Palette size={14} className="text-[#D4AF37]" />
            Bảng màu chuẩn PBR (Floral Luxury Palette)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {colorItems.map((c) => (
              <div
                key={c.hex}
                className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5"
              >
                <div
                  className="w-12 h-12 rounded-lg shadow-inner flex items-center justify-center text-[10px] font-mono font-bold border border-black/20 shrink-0"
                  style={{ backgroundColor: c.hex, color: c.textColor }}
                >
                  {c.hex}
                </div>
                <div className="text-xs">
                  <div className="font-semibold text-white">{c.name}</div>
                  <div className="text-gray-400 text-[11px] leading-tight mt-0.5">
                    {c.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cấu trúc mặt bằng & Kiến trúc */}
        <div className="mt-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-300 flex items-center gap-1.5 mb-3">
            <Layers size={14} className="text-[#A7BBD6]" />
            Quy Hoạch Mặt Bằng Sảnh Tiệc (Architectural Specifications)
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs text-gray-300">
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <span className="text-[#D4AF37] font-semibold">Kích Thước Sảnh:</span>
              <p className="mt-1 text-gray-400">
                30m x 40m, trần cao 8m. Sảnh kín phủ rèm voan (draping) che khu phụ trợ và WC.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <span className="text-[#D4AF37] font-semibold">Sân Khấu Chính:</span>
              <p className="mt-1 text-gray-400">
                Khối chữ nhật kết hợp mũi bán nguyệt nhô ra phía trước, 1 bậc tam cấp chính giữa, 2 cầu thang uốn hai bên cánh gà.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <span className="text-[#D4AF37] font-semibold">Quy Mô Bàn Tiệc:</span>
              <p className="mt-1 text-gray-400">
                46 bàn tròn (23 bàn/cánh). 460 ghế Chiavari mạ vàng. InstancedMesh tối ưu 60 FPS.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <span className="text-[#D4AF37] font-semibold">Tiền Sảnh (Reception):</span>
              <p className="mt-1 text-gray-400">
                Ngăn cách bởi tường có 3 cửa đôi mở. Bàn đón tiếp trung tâm & Backdrop Photobooth check-in.
              </p>
            </div>
          </div>
        </div>

        {/* Nút đóng */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-black font-semibold text-xs transition-colors"
          >
            Đã hiểu & Tiếp tục khám phá
          </button>
        </div>
      </div>
    </div>
  );
}

