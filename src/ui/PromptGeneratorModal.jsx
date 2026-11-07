import React, { useState } from 'react';
import { X, Sparkles, Copy, Check, Terminal, Camera, Sliders } from 'lucide-react';

/**
 * Modal sinh câu lệnh Prompt Render 3D (Tone Sáng Sang Trọng)
 */
export default function PromptGeneratorModal({ isOpen, onClose }) {
  const [copiedId, setCopiedId] = useState(null);
  const [selectedEngine, setSelectedEngine] = useState('midjourney');

  if (!isOpen) return null;

  const promptPresets = [
    {
      id: 'overview',
      title: 'Toàn cảnh Quy hoạch Sảnh tiệc (Overview View)',
      angle: 'Wide-angle bird\'s eye 3D architectural render, looking down at full 30x40m ballroom',
      prompt: `Bright and airy luxury 3D architectural render of a grand wedding ballroom interior, illuminated symmetrical layout looking down an ivory white carpet center aisle toward a brilliantly lit raised stage with a semi-circular front extension and curved staircases. Floral Luxury concept "The Thousand Bloom", dense layered floral arches on stage featuring ivory roses, dusty blue hydrangeas, blush pink blooms, and sage green foliage with curved floral hedges along the stage rim. Soft sheer ivory voile curtains draped across walls under bright warm champagne lighting (~3000K). 46 round banquet tables symmetrically arranged with ivory tablecloths, dusty blue napkins, gold Chiavari chairs, tall crystal candelabras, and elevated floral centerpieces. Sparkling crystal chandeliers hanging from high coffered ceiling. Ultra-bright, photorealistic, Octane Render, 8k resolution, architectural visualization --ar 16:9 --v 6.0`,
      fluxPrompt: `High-key architectural photograph of an opulent, brightly lit wedding ballroom, 30m by 40m layout with 8m ceiling. Central ivory carpet aisle leading toward a radiant raised northern stage with a semi-circular front curve and twin curved side staircases. Extravagant floral arches in dusty blue, blush pink, ivory, and sage green with metallic gold accents. Symmetrical arrangement of 46 round tables with champagne gold Chiavari chairs and tall crystal candelabra centerpieces. Sheer ivory voile pleated curtains, glowing candle lanterns, sparkling chandeliers, 8k photo, Hasselblad H6D-100c, master lighting.`
    },
    {
      id: 'aisle',
      title: 'Trục Lối đi Trung tâm & Sân khấu (Center Aisle View)',
      angle: 'Eye-level wide shot from the grand entrance doors looking straight to the main stage',
      prompt: `Bright eye-level interior photograph from the main entrance of an upscale wedding ballroom, looking straight down an ivory carpet runner toward an intensely illuminated semi-circular stage. Flanking the aisle are low organic flower beds of dusty blue hydrangeas, blush pink garden roses, and eucalyptus leaves interspersed with glowing glass hurricane candle pillars. The north stage features multi-layered golden arches overflowing with dense floral blooms and a curved floral rim, centered with glowing gold typography "The Thousand Bloom". Grand crystal chandeliers and warm stage spotlights cast radiant champagne light. Photorealistic, soft depth of field, Octane Render, 8k, pristine luxury wedding atmosphere --ar 16:9 --v 6.0`,
      fluxPrompt: `Eye-level shot looking down the center aisle of a floral luxury wedding reception. Pristine ivory carpet bordered with lush dusty blue hydrangeas, blush pink roses, and glass cylinder candles with flickering flame lights. Raised semi-circular stage at the end with golden layered floral arches and delicate sheer curtains. Romantic warm atmospheric lighting, warm champagne tones, f/2.8 bokeh, hyper-detailed textures.`
    },
    {
      id: 'table',
      title: 'Cận cảnh Bàn tiệc VIP & Decor (Table Close-up)',
      angle: 'Medium close-up shot focused on a luxury round banquet table for 10 guests',
      prompt: `Bright and luminous close-up shot of a luxury round wedding banquet table set for 10 guests in an opulent ballroom. Floor-length ivory textured tablecloth, polished gold Chiavari chairs with soft cushions, fine bone china plates folded with dusty blue linen napkins, and crystal wine goblets catching radiant light. At the center of the table stands an elevated tall champagne gold candelabra centerpiece with lush spheres of dusty blue hydrangeas, blush pink peonies, and trailing sage green leaves. Soft blurred background of glowing chandeliers, shallow depth of field, f/1.8, editorial luxury wedding photography --ar 16:9 --v 6.0`,
      fluxPrompt: `Detailed editorial photograph of a lavish 10-person round wedding table. Crisp ivory linen tablecloth, dusty blue folded napkins, polished cutlery, crystal glassware, and gold Chiavari chairs. Slender tall golden centerpiece topped with a dome of fresh hydrangeas and roses with glowing taper candles. Dreamy warm bokeh background, elegant wedding magazine feature, cinematic lighting.`
    },
    {
      id: 'stage',
      title: 'Chi tiết Vòm hoa Sân khấu & Chữ Ánh kim (Stage Arch Detail)',
      angle: 'Front elevation shot of the semi-circular stage and multi-tier floral arches',
      prompt: `Intensely illuminated frontal architectural detail shot of a wedding stage with a raised semi-circular front platform and three central ivory steps bordered by floral cascades. Densely layered multi-tier golden arches covered in blooms: dusty blue hydrangeas, blush pink roses, ivory blossoms, and sage green foliage, with matching floral hedge running along the stage front rim. In the center, luminous champagne gold 3D typography reading "The Thousand Bloom" with glowing halo backlight and subtitle "Ngàn hoa, một hành trình". Powerful warm uplights and followspots cast dramatic golden light. Photorealistic 3D render, luxury event production design --ar 16:9 --v 6.0`,
      fluxPrompt: `Detailed shot of an ornate wedding stage backdrop. Semi-circular tiered stage with ivory steps, golden arch structure bursting with dusty blue and blush pink flowers. Polished gold lettering "The Thousand Bloom", warm amber uplighting highlighting the petals, soft sheer fabric background, wedding ceremony mood, pristine luxury event design.`
    },
    {
      id: 'reception',
      title: 'Khu vực Tiền sảnh & Check-in (Foyer & Photobooth)',
      angle: 'Foyer area view with reception desk and floral check-in backdrop',
      prompt: `Bright interior view of a wedding reception foyer area outside the main ballroom doors. In the center is a sleek ivory reception desk with a gold front panel, glass wishing well box, leather guestbook, and floral runner. To the right is an arched photobooth backdrop covered in dusty blue and blush pink flowers with gold signage. Triple double doors with gold moldings open into the ballroom beyond. Polished light marble flooring reflecting crystal chandelier lighting, luxury hospitality interior, 8k render --ar 16:9 --v 6.0`,
      fluxPrompt: `Elegant wedding entrance foyer with a curved reception desk, gold trimmed glass card box, floral photo backdrop arch with blush pink and dusty blue blooms, and grand double doors leading into the ballroom. High-end luxury venue interior, warm welcoming light.`
    }
  ];

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#FAF7F2] border border-[#D4AF37]/60 rounded-2xl max-w-3xl w-full p-6 shadow-2xl text-[#2A231C] max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/25 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#D4AF37]/20 text-[#8C6D1F] border border-[#D4AF37]/40">
              <Camera size={22} />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-[#2A231C]">
                Bộ Prompt Render 3D Điện Ảnh (AI Visual Prompts)
              </h2>
              <p className="text-xs text-[#8C6D1F] uppercase font-bold tracking-wider font-sans">
                Tạo ảnh 3D chân thực bằng Midjourney v6 • Flux • Stable Diffusion
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black p-1.5 rounded-lg hover:bg-black/5 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Engine Filter */}
        <div className="py-3 flex items-center justify-between border-b border-[#D4AF37]/25 text-xs shrink-0">
          <span className="text-gray-600 flex items-center gap-1.5 font-medium">
            <Sliders size={14} className="text-[#3E6596]" /> Định dạng Render Engine:
          </span>
          <div className="flex gap-1.5">
            {[
              { id: 'midjourney', label: 'Midjourney v6' },
              { id: 'flux', label: 'Flux.1 / SDXL' }
            ].map((engine) => (
              <button
                key={engine.id}
                onClick={() => setSelectedEngine(engine.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedEngine === engine.id
                    ? 'bg-[#D4AF37] text-white shadow-sm'
                    : 'bg-white text-gray-700 border border-[#D4AF37]/30 hover:bg-[#F5EFE6]'
                }`}
              >
                {engine.label}
              </button>
            ))}
          </div>
        </div>

        {/* Prompts List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {promptPresets.map((p) => {
            const activeText = selectedEngine === 'midjourney' ? p.prompt : p.fluxPrompt;
            const isCopied = copiedId === p.id;

            return (
              <div
                key={p.id}
                className="p-4 rounded-xl bg-white border border-[#D4AF37]/30 hover:border-[#D4AF37] shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 className="text-sm font-bold text-[#2A231C] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#D4AF37]"></span>
                      {p.title}
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">{p.angle}</p>
                  </div>
                  <button
                    onClick={() => handleCopy(activeText, p.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all ${
                      isCopied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#D4AF37]/20 text-[#8C6D1F] hover:bg-[#D4AF37]/30 border border-[#D4AF37]/50'
                    }`}
                  >
                    {isCopied ? <Check size={14} /> : <Copy size={14} />}
                    <span>{isCopied ? 'Đã sao chép!' : 'Copy Prompt'}</span>
                  </button>
                </div>

                <div className="p-3 rounded-lg bg-[#FAF7F2] border border-[#D4AF37]/20 font-mono text-[11px] text-gray-800 leading-relaxed select-all">
                  {activeText}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#D4AF37]/25 flex items-center justify-between text-xs text-gray-600 shrink-0">
          <span>Prompt tuân thủ cấu trúc chuẩn: Góc máy + Concept + Hoa + Bàn tiệc + Màu PBR + Ánh sáng</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-black/5 hover:bg-black/10 text-gray-700 transition-colors font-medium"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
