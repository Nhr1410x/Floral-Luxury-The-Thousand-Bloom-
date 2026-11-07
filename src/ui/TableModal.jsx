import React from 'react';
import { X, Users, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';
import { PALETTE } from '../constants/colors';

export default function TableModal({ table, onClose, onFocusCamera }) {
  if (!table) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 w-96 bg-[#FAF7F2]/98 backdrop-blur-xl border border-[#D4AF37]/60 rounded-2xl p-5 shadow-2xl text-[#2A231C] animate-in fade-in slide-in-from-bottom duration-300">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-[#D4AF37]/25 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide bg-[#D4AF37]/20 text-[#8C6D1F] border border-[#D4AF37]/40">
              BÀN SỐ #{table.number}
            </span>
            {table.isVip && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F7C8D1]/40 text-[#8E324A] border border-[#F7C8D1] flex items-center gap-1">
                <Sparkles size={10} /> VIP
              </span>
            )}
          </div>
          <h3 className="text-lg font-serif font-bold mt-1 text-[#2A231C]">
            {table.category}
          </h3>
          <p className="text-xs text-gray-600 flex items-center gap-1.5 mt-0.5 font-medium">
            <MapPin size={12} className="text-[#3E6596]" />
            Khu vực: {table.wing} (Hàng {table.row}, Cột {table.col})
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-black p-1 rounded-lg hover:bg-black/5 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Thông tin số ghế & vật dụng */}
      <div className="py-3 grid grid-cols-2 gap-2 text-xs border-b border-[#D4AF37]/25">
        <div className="bg-white/90 p-2.5 rounded-xl border border-[#D4AF37]/25 shadow-sm">
          <div className="text-gray-600 flex items-center gap-1 text-[11px] font-semibold">
            <Users size={12} className="text-[#8C6D1F]" /> Sức chứa
          </div>
          <div className="text-sm font-bold text-[#2A231C] mt-1">
            {table.seats} Khách mời
          </div>
          <div className="text-[10px] text-gray-500">10 Ghế Chiavari mạ vàng</div>
        </div>

        <div className="bg-white/90 p-2.5 rounded-xl border border-[#D4AF37]/25 shadow-sm">
          <div className="text-gray-600 text-[11px] font-semibold">Decor & Centerpiece</div>
          <div className="text-sm font-bold text-[#3E6596] mt-1">
            Tall Centerpiece
          </div>
          <div className="text-[10px] text-gray-500">Khăn ăn Dusty Blue</div>
        </div>
      </div>

      {/* Thực đơn tiệc cưới cao cấp */}
      <div className="py-3 text-xs">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#8C6D1F] mb-2">
          Thực Đơn Tiệc (Floral Luxury Menu)
        </h4>
        <ul className="space-y-1.5 text-gray-700 text-[11px] font-medium">
          <li className="flex items-center gap-1.5">
            <CheckCircle2 size={12} className="text-[#3E6596]" />
            <span>Khai vị: Súp Vi Cá Bào Ngư & Gỏi Tôm Càng Hoàng Gia</span>
          </li>
          <li className="flex items-center gap-1.5">
            <CheckCircle2 size={12} className="text-[#A13A56]" />
            <span>Món chính: Thăn Bò Wagyu Áp Chảo & Cá Hồi Na Uy Sốt Bơ</span>
          </li>
          <li className="flex items-center gap-1.5">
            <CheckCircle2 size={12} className="text-[#4E6B43]" />
            <span>Tráng miệng: Mousse Hoa Hồng Phấn & Trà Thảo Mộc</span>
          </li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-2">
        <button
          onClick={onFocusCamera}
          className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#B38F24] hover:from-[#E5C158] hover:to-[#C9A233] text-white font-bold text-xs py-2 px-3 rounded-xl shadow-md transition-all"
        >
          Zoom Góc Nhìn Bàn Này
        </button>
        <button
          onClick={onClose}
          className="bg-black/5 hover:bg-black/10 text-gray-700 text-xs py-2 px-3 rounded-xl transition-all font-medium"
        >
          Đóng
        </button>
      </div>
    </div>
  );
}
