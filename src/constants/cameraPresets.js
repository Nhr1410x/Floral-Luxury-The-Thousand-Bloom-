export const CAMERA_PRESETS = [
  {
    id: 'overview',
    label: 'Toàn cảnh (Overview)',
    description: 'Góc nhìn quy hoạch 3D từ trên cao toàn bộ không gian 30m x 40m',
    icon: 'Maximize2',
    position: [0, 27, 26],
    target: [0, 1.5, -2],
    fov: 48
  },
  {
    id: 'aisle',
    label: 'Lối đi & Sân khấu (Center Aisle)',
    description: 'Góc nhìn tầm mắt từ cửa sảnh chính dẫn thẳng lên lễ đường ngàn hoa',
    icon: 'Compass',
    position: [0, 1.65, 18.5],
    target: [0, 2.2, -15.5],
    fov: 52
  },
  {
    id: 'table',
    label: 'Cận cảnh Bàn tiệc (Table Close-up)',
    description: 'Chi tiết bài trí bàn tiệc VIP: Ghế Chiavari vàng, khăn ăn Dusty Blue, tall centerpiece',
    icon: 'Utensils',
    position: [-3.6, 1.55, -9.8],
    target: [-5.0, 1.1, -11.2],
    fov: 45
  },
  {
    id: 'reception',
    label: 'Sảnh Đón khách (Reception Area)',
    description: 'Tiền sảnh bên ngoài: Bàn đón tiếp, Backdrop check-in chụp hình hoa tươi',
    icon: 'Sparkles',
    position: [0, 2.2, 29.0],
    target: [0, 1.5, 23.5],
    fov: 50
  }
];

