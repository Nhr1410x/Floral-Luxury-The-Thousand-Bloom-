import React, { Suspense, useImperativeHandle } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
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
 * Component hỗ trợ xuất ảnh Snapshot độ phân giải cao
 */
function ScreenshotCapture({ captureRef }) {
  const { gl, scene, camera } = useThree();

  useImperativeHandle(captureRef, () => ({
    capture: (filename = 'The-Thousand-Bloom-Ballroom.png') => {
      gl.render(scene, camera);
      const dataUrl = gl.domElement.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      link.click();
    }
  }));

  return null;
}

/**
 * 3D Canvas Scene tổng thể (Sáng Nổi Bật & Chiều Sâu Điện Ảnh):
 * - Nền không gian tối nhẹ ấm áp, tạo độ tương phản cao (High Contrast)
 * - Tôn vinh rực rỡ sân khấu chính, vòm hoa, lối đi thảm kem và đèn chùm pha lê
 * - Hiệu ứng Bloom cân chỉnh chính xác, ánh nến lung linh không bị chói lóa
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
  onTourEnd,
  captureRef
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
          alpha: false,
          preserveDrawingBuffer: true
        }}
        onPointerMissed={() => {
          onSelectTable(null);
        }}
      >
        {/* Nền sảnh tiệc tone ấm có chiều sâu tương phản, giúp các điểm nhấn bừng sáng */}
        <color attach="background" args={['#18151E']} />
        <fog attach="fog" args={['#1E1A24', 28, 72]} />

        <Suspense fallback={null}>
          <ScreenshotCapture captureRef={captureRef} />

          {/* Hệ thống ánh sáng tương phản nổi bật */}
          <LightingController lightMode={lightMode} />

          {/* Quản lý camera & góc nhìn */}
          <CameraManager
            activePresetId={activePresetId}
            selectedTable={selectedTable}
            isAutoRotate={isAutoRotate}
            isCinematicTour={isCinematicTour}
            onTourEnd={onTourEnd}
          />

          {/* 1. Không gian kiến trúc sảnh 30m x 40m x 8m */}
          <BallroomStructure />

          {/* 2. Sân khấu chính nổi bật hoa tươi & ánh sáng */}
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

          {/* 7. Hiệu ứng hậu kỳ PostProcessing */}
          {enableBloom && (
            <EffectComposer multisampling={4} disableNormalPass>
              <Bloom
                luminanceThreshold={0.62}
                luminanceSmoothing={0.7}
                intensity={lightMode === 'ceremony' ? 1.0 : 0.65}
                mipmapBlur
              />
              <Vignette
                offset={0.16}
                darkness={0.32}
                eskil={false}
              />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
