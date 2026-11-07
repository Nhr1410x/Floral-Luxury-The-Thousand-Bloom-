import React, { useState } from 'react';
import {
  Maximize2,
  Compass,
  Utensils,
  Sparkles,
  Sun,
  Moon,
  RotateCw,
  VolumeX,
  Volume2,
  Info,
  Hash,
  Eye,
  Camera,
  Play,
  Square,
  Search,
  Download
} from 'lucide-react';
import { CAMERA_PRESETS } from '../constants/cameraPresets';
import MiniFloorPlan from './MiniFloorPlan';
import { weddingAudio } from '../utils/sound';
import { TABLES_LIST } from '../constants/layoutData';

/**
 * Thanh công cụ điều khiển giao diện nổi (Tone Sáng Sang Trọng - Luxury Light Glassmorphism):
 * - Nền trắng kem ngà (Ivory `#FAF7F2`) kết hợp viền vàng ánh kim (Champagne Gold `#D4AF37`)
 * - Chữ than chì cao cấp và vàng kim vương giả
 * - Đầy đủ phím tắt chuyển góc nhìn, flycam tour, chụp ảnh và tìm kiếm bàn tiệc
 */
export default function ControlOverlay({
  activePresetId,
  onSelectPreset,
  lightMode,
  onToggleLightMode,
  selectedTable,
  onSelectTable,
  isAutoRotate,
  onToggleAutoRotate,
  showTableNumbers,
  onToggleTableNumbers,
  enableBloom,
  onToggleBloom,
  onOpenStyleGuide,
  onOpenPromptGenerator,
  isCinematicTour,
  onToggleCinematicTour,
  onTakeScreenshot
}) {
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);

  const handleToggleMusic = () => {
    if (isPlayingMusic) {
      weddingAudio.stop();
      setIsPlayingMusic(false);
    } else {
      weddingAudio.start();
      setIsPlayingMusic(true);
    }
  };

  const handleCaptureClick = () => {
    setIsCapturing(true);
    if (onTakeScreenshot) onTakeScreenshot();
    setTimeout(() => setIsCapturing(false), 1200);
  };

  const getPresetIcon = (iconName) => {
    switch (iconName) {
      case 'Maximize2':
        return <Maximize2 size={16} />;
      case 'Compass':
        return <Compass size={16} />;
      case 'Utensils':
        return <Utensils size={16} />;
      case 'Sparkles':
        return <Sparkles size={16} />;
      default:
        return <Eye size={16} />;
    }
  };

  const filteredTables = searchQuery.trim()
    ? TABLES_LIST.filter(
        (t) =>
          t.number.toString().includes(searchQuery.trim()) ||
          t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.wing.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="pointer-events-none fixed inset-0 z-40 p-4 md:p-6 flex flex-col justify-between overflow-hidden">
      {/* 1. TOP HEADER: TONE SÁNG SANG TRỌNG */}
      <header className="pointer-events-auto flex flex-wrap items-center justify-between gap-3 bg-[#FAF7F2]/95 backdrop-blur-xl border border-[#D4AF37]/50 rounded-2xl px-5 py-3 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B38F24] p-0.5 flex items-center justify-center shadow-md shadow-[#D4AF37]/30">
            <div className="w-full h-full bg-[#FFFDF9] rounded-[10px] flex items-center justify-center text-[#B38F24]">
              <Sparkles size={18} />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base md:text-lg font-serif font-bold text-[#2A231C] tracking-wide">
                The Thousand Bloom
              </h1>
              <span className="hidden sm:inline-block px-2.5 py-0.5 text-[10px] font-semibold bg-[#D4AF37]/15 text-[#8C6D1F] rounded-full border border-[#D4AF37]/30">
                46 Bàn • 460 Khách
              </span>
            </div>
            <p className="text-[11px] text-[#A38020] tracking-wider uppercase font-sans font-semibold">
              Ngàn hoa, một hành trình • Sảnh tiệc cưới 3D (30m x 40m)
            </p>
          </div>
        </div>

        {/* Nút chức năng phía trên bên phải */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Nút Chụp ảnh Snapshot 3D */}
          <button
            onClick={handleCaptureClick}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all border shadow-sm ${
              isCapturing
                ? 'bg-emerald-600 text-white border-emerald-500'
                : 'bg-white text-[#2A231C] border-[#D4AF37]/40 hover:bg-[#F5EFE6]'
            }`}
            title="Chụp ảnh sảnh tiệc chất lượng cao và tải về máy"
          >
            <Download size={14} className={isCapturing ? 'animate-bounce' : 'text-[#A38020]'} />
            <span>{isCapturing ? 'Đang lưu ảnh...' : 'Chụp ảnh 3D'}</span>
          </button>

          {/* Nút Tour Flycam Điện Ảnh */}
          <button
            onClick={onToggleCinematicTour}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all border shadow-sm ${
              isCinematicTour
                ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
                : 'bg-[#D4AF37]/20 text-[#8C6D1F] border-[#D4AF37]/50 hover:bg-[#D4AF37]/30'
            }`}
            title="Khởi động Tour quay điện ảnh tự động khắp sảnh tiệc"
          >
            {isCinematicTour ? <Square size={14} /> : <Play size={14} />}
            <span>{isCinematicTour ? 'Dừng Flycam Tour' : 'Cinematic Tour'}</span>
          </button>

          {/* Mode Switch: Reception Mode vs Ceremony Mode */}
          <button
            onClick={onToggleLightMode}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all border shadow-sm ${
              lightMode === 'ceremony'
                ? 'bg-[#3A3024] text-[#FFE8B8] border-[#D4AF37]/60 shadow-md'
                : 'bg-white text-[#2A231C] border-[#D4AF37]/40 hover:bg-[#F5EFE6]'
            }`}
            title="Chuyển đổi ánh sáng Sảnh tiệc"
          >
            {lightMode === 'ceremony' ? (
              <>
                <Moon size={14} className="text-[#F3E5AB]" />
                <span className="hidden sm:inline">Ceremony Mode (Ấm áp)</span>
              </>
            ) : (
              <>
                <Sun size={14} className="text-amber-500" />
                <span className="hidden sm:inline">Reception Mode (Rực rỡ)</span>
              </>
            )}
          </button>

          {/* Nút Prompt Render 3D */}
          <button
            onClick={onOpenPromptGenerator}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#D4AF37]/40 text-[#4A6487] hover:text-[#2A231C] hover:bg-[#F5EFE6] text-xs font-medium transition-all"
            title="Lấy Prompt Render ảnh 3D chân thực bằng AI"
          >
            <Camera size={15} />
            <span className="hidden md:inline">Prompt AI Render</span>
          </button>

          {/* Nút xem Bảng màu & Concept Moodboard */}
          <button
            onClick={onOpenStyleGuide}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#D4AF37]/40 text-[#8E445B] hover:text-[#2A231C] hover:bg-[#F5EFE6] text-xs font-medium transition-all"
            title="Xem Moodboard & Bảng màu HEX chuẩn"
          >
            <Info size={15} />
            <span className="hidden md:inline">Moodboard</span>
          </button>

          {/* Âm thanh nhạc nền đám cưới */}
          <button
            onClick={handleToggleMusic}
            className={`p-2 rounded-xl border text-xs transition-all ${
              isPlayingMusic
                ? 'bg-[#D4AF37] text-white border-[#D4AF37]'
                : 'bg-white border-[#D4AF37]/40 text-gray-600 hover:text-[#2A231C]'
            }`}
            title={isPlayingMusic ? 'Tắt nhạc nền' : 'Bật nhạc nền Canon in D'}
          >
            {isPlayingMusic ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
        </div>
      </header>

      {/* 2. MIDDLE AREA: TÌM KIẾM BÀN TIỆC & MINI FLOOR PLAN */}
      <div className="pointer-events-none flex-1 flex items-end justify-between py-2">
        {/* Thanh tìm kiếm bàn tiệc nhanh ở góc dưới trái (Tone Sáng) */}
        <div className="pointer-events-auto hidden md:block w-64 bg-[#FAF7F2]/95 backdrop-blur-md border border-[#D4AF37]/40 rounded-xl p-2.5 shadow-xl">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-2.5 text-gray-500" />
            <input
              type="text"
              placeholder="Tìm số bàn, VIP, khu vực..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#D4AF37]/30 rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#2A231C] placeholder-gray-400 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>
          {filteredTables.length > 0 && (
            <div className="mt-2 max-h-40 overflow-y-auto space-y-1">
              {filteredTables.slice(0, 5).map((t) => (
                <div
                  key={t.id}
                  onClick={() => {
                    onSelectTable(t);
                    setSearchQuery('');
                  }}
                  className="px-2 py-1.5 rounded-lg bg-white/80 hover:bg-[#D4AF37]/20 cursor-pointer text-[11px] flex items-center justify-between text-[#2A231C]"
                >
                  <span className="font-semibold text-[#8C6D1F]">Bàn #{t.number}</span>
                  <span className="text-gray-600 truncate max-w-[120px]">{t.category}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sơ đồ mặt bằng 2D tương tác ở góc phải */}
        <div className="pointer-events-auto">
          <MiniFloorPlan
            selectedTable={selectedTable}
            onSelectTable={onSelectTable}
            activePresetId={activePresetId}
            onSelectPreset={onSelectPreset}
          />
        </div>
      </div>

      {/* 3. BOTTOM FLOATING CONTROLS: 4 CAMERA PRESETS (TONE SÁNG) */}
      <footer className="pointer-events-auto flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#FAF7F2]/95 backdrop-blur-xl border border-[#D4AF37]/50 rounded-2xl p-2.5 shadow-xl">
        {/* Nhóm 4 Camera Presets */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto justify-center sm:justify-start">
          <span className="text-[11px] uppercase tracking-wider text-gray-500 font-bold px-2 hidden lg:inline">
            Góc nhìn:
          </span>
          {CAMERA_PRESETS.map((preset) => {
            const isActive = activePresetId === preset.id && !isCinematicTour;
            return (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-white shadow-md shadow-[#D4AF37]/30'
                    : 'bg-white text-gray-700 border border-[#D4AF37]/30 hover:text-black hover:bg-[#F5EFE6]'
                }`}
                title={preset.description}
              >
                {getPresetIcon(preset.icon)}
                <span>{preset.label}</span>
              </button>
            );
          })}
        </div>

        {/* Các nút toggle phụ trợ */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onToggleAutoRotate}
            className={`p-2 rounded-xl border text-xs transition-all ${
              isAutoRotate
                ? 'bg-[#D4AF37] text-white border-[#D4AF37]'
                : 'bg-white border-[#D4AF37]/40 text-gray-700 hover:text-black'
            }`}
            title="Tự động xoay nhẹ quanh sảnh"
          >
            <RotateCw size={15} />
          </button>

          <button
            onClick={onToggleTableNumbers}
            className={`flex items-center gap-1 px-2.5 py-2 rounded-xl border text-xs transition-all ${
              showTableNumbers
                ? 'bg-[#D4AF37] text-white border-[#D4AF37]'
                : 'bg-white border-[#D4AF37]/40 text-gray-700 hover:text-black'
            }`}
            title="Bật/tắt số bàn 3D"
          >
            <Hash size={14} />
            <span className="text-[11px] hidden md:inline">Số bàn</span>
          </button>

          <button
            onClick={onToggleBloom}
            className={`flex items-center gap-1 px-2.5 py-2 rounded-xl border text-xs transition-all ${
              enableBloom
                ? 'bg-[#D4AF37] text-white border-[#D4AF37]'
                : 'bg-white border-[#D4AF37]/40 text-gray-700 hover:text-black'
            }`}
            title="Bật/tắt hiệu ứng lung linh (Bloom)"
          >
            <Sparkles size={14} />
            <span className="text-[11px] hidden md:inline">Bloom</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
