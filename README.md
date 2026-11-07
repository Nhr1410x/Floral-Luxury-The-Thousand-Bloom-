# The Thousand Bloom - Mô Phỏng Không Gian Tiệc Cưới 3D

Ứng dụng Web 3D tương tác mô phỏng không gian phòng tiệc cưới cao cấp (Floral Luxury) dựa trên sơ đồ mặt bằng 2D và concept **"The Thousand Bloom - Ngàn hoa, một hành trình"**.

Được xây dựng bằng **React + Three.js / @react-three/fiber + @react-three/drei + Tailwind CSS**.

---

## 🌟 Tính Năng Nổi Bật

### 1. Kiến Trúc Sảnh Tiệc Chuẩn Tỷ Lệ Thực (30m x 40m x 8m)
- **Sảnh Kín Hoàn Toàn:** Không có cửa sổ kính nhìn ra ngoài trời theo đúng thực tế mặt bằng trung tâm hội nghị.
- **Hệ Rèm Voan Rủ (Sheer Voile Draping):** Toàn bộ tường bao quanh được phủ các nếp gấp rèm voan dập dềnh màu trắng kem (Ivory `#F8F6F0`) che khuất hành lang phục vụ, cánh gà và khu vệ sinh.
- **Trục Lối Đi Trung Tâm (Center Aisle):** Thảm trắng kem viền nẹp vàng dẫn từ cụm 3 cửa đôi ở tiền sảnh thẳng lên mũi sân khấu. Hai bên mép thảm đan xen hoa tươi thấp và các trụ nến thủy tinh (glass hurricane lamps) phát sáng lung linh.
- **Sân Khấu Chính Phía Bắc:** 
  - Khối chữ nhật lùi sau kết hợp mũi sân khấu hình bán nguyệt (semi-circular extension) nhô ra phía trước.
  - 1 bậc tam cấp ở chính giữa mũi bán nguyệt dẫn xuống thảm lối đi.
  - 2 cầu thang uốn nhẹ ở hai bên cánh gà trái/phải với lan can mạ vàng.
  - Bục cắt bánh cưới hoa 4 tầng và tháp ly Champagne pha lê.
  - Hệ vòm hoa đa tầng (layered floral arch) kết hợp typography 3D ánh kim *"The Thousand Bloom"*.
- **Quy Hoạch 46 Bàn Tiệc Đối Xứng & 460 Ghế Chiavari:**
  - Hàng 1 (ngang mũi bán nguyệt): 3 bàn mỗi bên (VIP Nhà Gái & VIP Nhà Trai).
  - 5 Hàng dưới: 4 bàn mỗi bên (20 bàn mỗi bên).
  - Tổng cộng 46 bàn tròn x 10 khách = 460 ghế Chiavari mạ vàng Champagne Gold.
  - Tối ưu hóa render bằng `InstancedMesh` đảm bảo tốc độ mượt mà 60 FPS.
  - Trên mỗi bàn có khăn trải bàn Ivory, 10 bộ đĩa sứ + napkin xanh pastel (Dusty Blue `#A7BBD6`), ly pha lê và bình hoa chân nến cao (*Tall Centerpiece*) không cản tầm nhìn của khách.
- **Khu Tiền Sảnh (Foyer & Reception):**
  - Ngăn cách bằng bức tường có 3 cửa đôi mở mạ vàng.
  - Bàn đón tiếp (Reception Desk) ở giữa với hộp kính mừng cưới, sổ lưu niệm và hoa tươi.
  - Backdrop check-in (Photobooth) chụp hình lưu niệm với vòm hoa và thảm tròn.
  - Lối vào phòng chờ Cô dâu (Bride Room).

### 2. Bảng Màu Chuẩn & Vật Liệu PBR (Floral Luxury)
| Màu sắc | Mã HEX | Ứng dụng trong Scene 3D |
| :--- | :--- | :--- |
| **Trắng kem (Ivory)** | `#F8F6F0` | Khăn trải bàn, thảm lối đi, rèm voan tường, bậc thang sân khấu |
| **Xanh dương pastel (Dusty Blue)** | `#A7BBD6` | Khăn ăn (napkin) trên bàn tiệc, cụm hoa cẩm tú cầu |
| **Hồng phấn (Blush Pink)** | `#F7C8D1` | Hoa hồng trang trí đan xen trên vòm hoa và lối đi |
| **Xanh lá tự nhiên (Sage Green)** | `#A7B89F` | Lá bạc Eucalyptus, cành rủ điểm xuyết quanh vòm và trần |
| **Vàng ánh kim (Champagne Gold)** | `#D4AF37` | Khung ghế Chiavari, chân nến cao, khung vòm (metalness: 0.88, roughness: 0.18) |
| **Vàng ấm (Warm Light)** | `#FFE4B5` | Ánh nến, đèn chùm pha lê, uplighting chân vòm sân khấu (~2800K) |

### 3. Hệ Thống Ánh Sáng & Hiệu Ứng Hậu Kỳ
- **Reception Mode:** Sảnh sáng rõ, tươi sáng, trang nhã để đón khách.
- **Ceremony Mode:** Ánh sáng tổng thể dịu xuống, tập trung spotlight vào thảm lối đi và sân khấu chính, tăng cường ánh nến và đèn chùm lấp lánh.
- **Post-Processing Bloom:** Tạo hiệu ứng tán xạ ánh sáng mềm mại (bloom glow) cho ngọn nến, đèn pha lê và hạt sáng fairy lights.

### 4. Tương Tác & Camera Presets
- **4 Preset Camera Chuyên Dụng:**
  1. `Toàn cảnh (Overview)`: Góc nhìn quy hoạch từ trên cao nhìn toàn bộ sảnh 30m x 40m.
  2. `Lối đi & Sân khấu (Center Aisle View)`: Góc nhìn ngang tầm mắt từ cửa chính nhìn thẳng lên sân khấu.
  3. `Cận cảnh Bàn tiệc (Table Close-up)`: Chi tiết bài trí bàn tiệc VIP.
  4. `Sảnh Đón khách (Reception Area)`: Khu vực tiền sảnh, bàn reception và backdrop photobooth.
- **Sơ Đồ Mặt Bằng 2D Radar Tương Tác:**
  - Hiển thị trực quan 46 bàn tiệc theo tọa độ chuẩn.
  - Bấm vào bất kỳ bàn nào trên sơ đồ 2D để zoom camera 3D đến bàn đó.
- **Pop-up Chi Tiết Bàn Tiệc:**
  - Hiển thị số bàn, phân khu, vị trí khách VIP, thực đơn tiệc cưới cao cấp (Set Menu).
- **Nhạc Nền Đám Cưới (Web Audio API Synthesizer):**
  - Giai điệu Canon in D lãng mạn nhẹ nhàng được tổng hợp trực tiếp bằng âm thanh sine wave, không cần tải file ngoài.

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

```bash
# Cài đặt các gói phụ thuộc (nếu chưa có)
npm install

# Khởi chạy máy chủ phát triển (Development Server)
npm run dev

# Đóng gói sản phẩm (Production Build)
npm run build
```

---

## 📂 Cấu Trúc Mã Nguồn

```
src/
├── components/
│   ├── BallroomStructure.jsx   # Không gian sảnh 30x40x8m, sàn đá cẩm thạch, rèm voan, 3 cửa đôi
│   ├── MainStage.jsx           # Sân khấu chữ nhật + mũi bán nguyệt, 3 bậc tam cấp, 2 cầu thang cánh gà, vòm hoa, chữ 3D
│   ├── CenterAisle.jsx         # Thảm kem, hoa tươi thấp, trụ nến thủy tinh phát sáng
│   ├── BanquetTables.jsx       # 46 bàn tiệc tròn & 460 ghế Chiavari mạ vàng bằng InstancedMesh
│   ├── ReceptionArea.jsx       # Tiền sảnh, bàn đón tiếp, backdrop photobooth
│   ├── CeilingAndDecor.jsx     # Đèn chùm pha lê, dải hoa treo trần, fairy lights
│   ├── LightingController.jsx  # Chuyển đổi Reception Mode / Ceremony Mode, spotlights
│   ├── CameraManager.jsx       # Điều khiển lerp camera mượt mà giữa các preset và bàn tiệc
│   └── Scene.jsx               # Khung Canvas Three.js & Post-Processing Bloom
├── constants/
│   ├── colors.js               # Bảng màu HEX chuẩn & PBR Material parameters
│   ├── layoutData.js           # Tọa độ toán học chính xác của 46 bàn tiệc, sân khấu, lối đi
│   └── cameraPresets.js        # Vị trí camera và góc quay cho 4 preset
├── ui/
│   ├── ControlOverlay.jsx      # Thanh công cụ nổi: chuyển góc nhìn, đổi ánh sáng, bật nhạc
│   ├── MiniFloorPlan.jsx       # Sơ đồ mặt bằng 2D tương tác
│   ├── TableModal.jsx          # Bảng thông tin chi tiết bàn tiệc & thực đơn
│   └── StyleGuideModal.jsx     # Bảng phân tích Concept & Moodboard màu sắc
├── utils/
│   └── sound.js                # Bộ phát nhạc nền đám cưới Web Audio API
├── App.jsx                     # Component chính kết nối State & UI
├── index.css                   # Tailwind CSS & Fonts
└── main.jsx                    # Điểm khởi đầu ứng dụng React
```

