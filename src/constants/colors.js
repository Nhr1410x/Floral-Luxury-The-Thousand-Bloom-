/**
 * Bảng màu chuẩn Concept "The Thousand Bloom - Ngàn hoa, một hành trình"
 * Phong cách Floral Luxury & PBR material parameters
 */
export const PALETTE = {
  // Trắng kem (Ivory): Khăn trải bàn, thảm lối đi, rèm voan tường, bậc thang sân khấu
  ivory: '#F8F6F0',
  ivorySoft: '#FAF8F5',
  ivoryDark: '#E8E5DD',

  // Xanh dương pastel (Dusty Blue): Khăn ăn (napkin), hoa cẩm tú cầu
  dustyBlue: '#A7BBD6',
  dustyBlueLight: '#C3D2E5',
  dustyBlueDark: '#859EBF',

  // Hồng phấn (Blush Pink): Hoa hồng trang trí đan xen
  blushPink: '#F7C8D1',
  blushPinkSoft: '#FBE3E7',
  blushPinkRose: '#EAA5B4',

  // Xanh lá tự nhiên (Sage Green): Lá bạc Eucalyptus, cành rủ
  sageGreen: '#A7B89F',
  sageGreenDark: '#7F9377',
  sageGreenLight: '#C8D4C3',

  // Vàng ánh kim (Champagne Gold): Khung ghế Chiavari, chân nến, khung vòm
  champagneGold: '#D4AF37',
  goldHighlight: '#F3E5AB',
  goldBronze: '#A38020',

  // Ánh sáng & Nến
  candleWarm: '#FFE4B5',      // Warm Champagne Gold ~ 2800K
  candleFlame: '#FF9E42',     // Ngọn nến phát sáng
  ambientWhite: '#FFF9F2',
  
  // Kiến trúc
  floorMarble: '#ECE8DF',     // Sàn đá cẩm thạch sáng bóng nhẹ
  wallBase: '#F0ECE4',
  doorWood: '#5A4634',
  stageWood: '#FFFFFF'
};

// PBR Material Settings
export const PBR_MATERIALS = {
  goldMetal: {
    color: PALETTE.champagneGold,
    metalness: 0.88,
    roughness: 0.18,
    clearcoat: 0.3,
    clearcoatRoughness: 0.1
  },
  crystalGlass: {
    color: '#FFFFFF',
    metalness: 0.05,
    roughness: 0.04,
    transmission: 0.92,
    ior: 1.52,
    thickness: 0.3,
    transparent: true,
    opacity: 0.85
  },
  sheerVoile: {
    color: PALETTE.ivory,
    roughness: 0.85,
    metalness: 0.02,
    transmission: 0.35,
    transparent: true,
    opacity: 0.88
  },
  tableLinen: {
    color: PALETTE.ivory,
    roughness: 0.75,
    metalness: 0.05
  },
  carpet: {
    color: PALETTE.ivorySoft,
    roughness: 0.9,
    metalness: 0.0
  },
  marbleFloor: {
    color: PALETTE.floorMarble,
    roughness: 0.22,
    metalness: 0.1
  }
};

