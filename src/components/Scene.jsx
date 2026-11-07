import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import BallroomStructure from './BallroomStructure';
import MainStage from './MainStage';
import CenterAisle from './CenterAisle';
import BanquetTables from './BanquetTables';
import ReceptionArea from './ReceptionArea';
import CeilingAndDecor from './CeilingAndDecor';
import LightingController from './LightingController';
import CameraManager from './CameraManager';
import { CAMERA_PRESETS } from '../constants/cameraPresets';

/**
 * 3D Canvas Scene tổng thể kết hợp PostProcessing:
 * - Hệ thống Bloom làm lung linh ánh nến và đèn chùm pha lê
 * - Tải mượt mà, hỗ trợ shadows và PBR photorealistic
 * - Sử dụng onPointerMissed chuẩn để bỏ chọn bàn khi bấm vào khoảng trống
 */
export default function Scene({
  activePresetId,
  lightMode,
  selectedTable,
  onSelectTable,
  isAutoRotate,
  showTableNumbers,
  enableBloom = true,
  isCinematicTour = false,
  onTourEnd
}) {
  const initialPreset = CAMERA_PRESETS.find((p) => p.id === activePresetId) || CAMERA_PRESETS[0];

  return (
    <div className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing">
      <Canvas
        shadows
        camera={{
          position: initialPreset.position,
          fov: initialPreset.fov,
          near: 0.1,
          far: 150
        }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: false
        }}
        onPointerMissed={() => {
          // Chỉ bỏ chọn khi người dùng bấm vào khoảng trống không có vật thể
          onSelectTable(null);
        }}
      >
        <color attach="background" args={['#100E14']} />
        <fog attach="fog" args={['#1E1A22', 15, 60]} />

        <Suspense fallback={null}>
          {/* Hệ thống ánh sáng thông minh */}
          <LightingController lightMode={lightMode} />

          {/* Quản lý camera & góc nhìn */}
          <CameraManager
            activePresetId={activePresetId}
            selectedTable={selectedTable}
            isAutoRotate={isAutoRotate}
            isCinematicTour={isCinematicTour}
            onTourEnd={onTourEnd}
          />

          {/* 1. Không gian kiến trúc sảnh 30m x 40m x 8m & Rèm voan */}
          <BallroomStructure />

          {/* 2. Sân khấu chính bán nguyệt & vòm hoa The Thousand Bloom */}
          <MainStage lightMode={lightMode} />

          {/* 3. Thảm lối đi trung tâm & hoa tươi & nến thủy tinh */}
          <CenterAisle lightMode={lightMode} />

          {/* 4. 46 Bàn tiệc tròn & 460 ghế Chiavari mạ vàng */}
          <BanquetTables
            selectedTable={selectedTable}
            onSelectTable={onSelectTable}
            lightMode={lightMode}
            showTableNumbers={showTableNumbers}
          />

          {/* 5. Tiền sảnh & Bàn Reception & Backdrop Check-in */}
          <ReceptionArea />

          {/* 6. Trần sảnh & Đèn chùm pha lê & Fairy lights */}
          <CeilingAndDecor lightMode={lightMode} />

          {/* 7. Hiệu ứng hậu kỳ PostProcessing (Bloom lung linh) */}
          {enableBloom && (
            <EffectComposer multisampling={4} disableNormalPass>
              <Bloom
                luminanceThreshold={0.55}
                luminanceSmoothing={0.7}
                intensity={lightMode === 'ceremony' ? 1.3 : 0.8}
                mipmapBlur
              />
              <Vignette
                offset={0.2}
                darkness={0.45}
                eskil={false}
              />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
