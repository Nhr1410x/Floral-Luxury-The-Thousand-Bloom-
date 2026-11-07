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
 * 3D Canvas Scene tổng thể (Tone Màu Sáng Sang Trọng - Floral Luxury Light):
 * - Không gian sảnh tiệc bừng sáng, ấm áp, lộng lẫy
 * - Nền kiến trúc màu kem ngà (Ivory) thanh thoát
 * - Sân khấu rực sáng với dàn đèn công suất lớn
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
        {/* Nền sảnh tiệc tone màu kem ngà sáng sang trọng (thay vì màu đen tối) */}
        <color attach="background" args={['#F5F2EB']} />
        <fog attach="fog" args={['#F5F2EB', 35, 95]} />

        <Suspense fallback={null}>
          <ScreenshotCapture captureRef={captureRef} />

          {/* Hệ thống ánh sáng thông minh tone sáng */}
          <LightingController lightMode={lightMode} />

          {/* Quản lý camera & góc nhìn */}
          <CameraManager
            activePresetId={activePresetId}
            selectedTable={selectedTable}
            isAutoRotate={isAutoRotate}
            isCinematicTour={isCinematicTour}
            onTourEnd={onTourEnd}
          />

          {/* 1. Không gian kiến trúc sảnh 30m x 40m x 8m & Rèm voan màu kem sáng */}
          <BallroomStructure />

          {/* 2. Sân khấu chính rực rỡ hoa tươi & dàn đèn công suất cao */}
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
                luminanceThreshold={0.7}
                luminanceSmoothing={0.6}
                intensity={lightMode === 'ceremony' ? 1.1 : 0.75}
                mipmapBlur
              />
              <Vignette
                offset={0.12}
                darkness={0.25}
                eskil={false}
              />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
