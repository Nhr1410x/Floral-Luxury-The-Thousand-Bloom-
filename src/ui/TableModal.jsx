import React from 'react';
import { X, Users, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';
import { PALETTE } from '../constants/colors';

export default function TableModal({ table, onClose, onFocusCamera }) {
  if (!table) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 w-96 bg-[#16141D]/95 backdrop-blur-xl border border-[#D4AF37]/40 rounded-2xl p-5 shadow-2xl text-white animate-in fade-in slide-in-from-bottom duration-300">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-white/10 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wide bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40">
              BÀN SỐ #{table.number}
            </span>
            {table.isVip && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F7C8D1]/20 text-[#F7C8D1] border border-[#F7C8D1]/40 flex items-center gap-1">
                <Sparkles size={10} /> VIP
              </span>
            )}
          </div>
          <h3 className="text-lg font-serif font-medium mt-1 text-[#F8F6F0]">
            {table.category}
          </h3>
          <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
            <MapPin size={12} className="text-[#A7BBD6]" />
            Khu vực: {table.wing} (Hàng {table.row}, Cột {table.col})
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Thông tin số ghế & vật dụng */}
      <div className="py-3 grid grid-cols-2 gap-2 text-xs border-b border-white/10">
        <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
          <div className="text-gray-400 flex items-center gap-1 text-[11px]">
            <Users size={12} className="text-[#D4AF37]" /> Sức chứa
          </div>
          <div className="text-sm font-semibold text-white mt-1">
            {table.seats} Khách mời
          </div>
          <div className="text-[10px] text-gray-400">10 Ghế Chiavari mạ vàng</div>
        </div>

        <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
          <div className="text-gray-400 text-[11px]">Decor & Centerpiece</div>
          <div className="text-sm font-semibold text-[#A7BBD6] mt-1">
            Tall Centerpiece
          </div>
          <div className="text-[10px] text-gray-400">Khăn ăn Dusty Blue</div>
        </div>
      </div>

      {/* Thực đơn tiệc cưới cao cấp (Royal Wedding Banquet Menu) */}
      <div className="py-3 text-xs">
        <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#D4AF37] mb-2">
          Thực Đơn Tiệc (Floral Luxury Menu)
        </h4>
        <ul className="space-y-1.5 text-gray-300 text-[11px]">
          <li className="flex items-center gap-1.5">
            <CheckCircle2 size={12} className="text-[#A7BBD6]" />
            <span>Khai vị: Súp Vi Cá Bào Ngư & Gỏi Tôm Càng Hoàng Gia</span>
          </li>
          <li className="flex items-center gap-1.5">
            <CheckCircle2 size={12} className="text-[#F7C8D1]" />
            <span>Món chính: Thăn Bò Wagyu Áp Chảo & Cá Hồi Na Uy Sốt Bơ</span>
          </li>
          <li className="flex items-center gap-1.5">
            <CheckCircle2 size={12} className="text-[#A7B89F]" />
            <span>Tráng miệng: Mousse Hoa Hồng Phấn & Trà Thảo Mộc</span>
          </li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-2">
        <button
          onClick={onFocusCamera}
          className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#B38F24] hover:from-[#E5C158] hover:to-[#C9A233] text-black font-semibold text-xs py-2 px-3 rounded-xl shadow-lg transition-all"
        >
          Zoom Góc Nhìn Bàn Này
        </button>
        <button
          onClick={onClose}
          className="bg-white/10 hover:bg-white/15 text-gray-200 text-xs py-2 px-3 rounded-xl transition-all"
        >
          Đóng
        </button>
      </div>
    </div>
  );
}

