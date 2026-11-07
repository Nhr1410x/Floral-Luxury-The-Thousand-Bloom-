import React, { useState, useRef } from 'react';
import Scene from './components/Scene';
import ControlOverlay from './ui/ControlOverlay';
import TableModal from './ui/TableModal';
import StyleGuideModal from './ui/StyleGuideModal';
import PromptGeneratorModal from './ui/PromptGeneratorModal';
import { TABLES_LIST } from './constants/layoutData';

export default function App() {
  const [activePresetId, setActivePresetId] = useState('overview');
  const [lightMode, setLightMode] = useState('ceremony');
  const [selectedTable, setSelectedTable] = useState(null);
  const [isAutoRotate, setIsAutoRotate] = useState(false);
  const [showTableNumbers, setShowTableNumbers] = useState(true);
  const [enableBloom, setEnableBloom] = useState(true);
  const [isStyleGuideOpen, setIsStyleGuideOpen] = useState(false);
  const [isPromptGeneratorOpen, setIsPromptGeneratorOpen] = useState(false);
  const [isCinematicTour, setIsCinematicTour] = useState(false);

  const captureRef = useRef();

  const handleToggleLightMode = () => {
    setLightMode((prev) => (prev === 'ceremony' ? 'reception' : 'ceremony'));
  };

  const handleSelectPreset = (presetId) => {
    setIsCinematicTour(false);
    setActivePresetId(presetId);
    if (presetId !== 'table') {
      setSelectedTable(null);
    } else {
      setSelectedTable(TABLES_LIST[0]);
    }
  };

  const handleSelectTable = (table) => {
    setIsCinematicTour(false);
    setSelectedTable(table);
  };

  const handleToggleCinematicTour = () => {
    setIsCinematicTour((prev) => !prev);
  };

  const handleTakeScreenshot = () => {
    if (captureRef.current) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      captureRef.current.capture(`The-Thousand-Bloom-${activePresetId}-${timestamp}.png`);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#F5F2EB] font-sans">
      {/* 3D WebGL Canvas Scene */}
      <Scene
        captureRef={captureRef}
        activePresetId={activePresetId}
        lightMode={lightMode}
        selectedTable={selectedTable}
        onSelectTable={handleSelectTable}
        isAutoRotate={isAutoRotate}
        showTableNumbers={showTableNumbers}
        enableBloom={enableBloom}
        isCinematicTour={isCinematicTour}
        onTourEnd={() => setIsCinematicTour(false)}
      />

      {/* Floating Luxury UI Toolbar */}
      <ControlOverlay
        activePresetId={activePresetId}
        onSelectPreset={handleSelectPreset}
        lightMode={lightMode}
        onToggleLightMode={handleToggleLightMode}
        selectedTable={selectedTable}
        onSelectTable={handleSelectTable}
        isAutoRotate={isAutoRotate}
        onToggleAutoRotate={() => setIsAutoRotate(!isAutoRotate)}
        showTableNumbers={showTableNumbers}
        onToggleTableNumbers={() => setShowTableNumbers(!showTableNumbers)}
        enableBloom={enableBloom}
        onToggleBloom={() => setEnableBloom(!enableBloom)}
        onOpenStyleGuide={() => setIsStyleGuideOpen(true)}
        onOpenPromptGenerator={() => setIsPromptGeneratorOpen(true)}
        isCinematicTour={isCinematicTour}
        onToggleCinematicTour={handleToggleCinematicTour}
        onTakeScreenshot={handleTakeScreenshot}
      />

      {/* Popover chi tiết bàn tiệc */}
      <TableModal
        table={selectedTable}
        onClose={() => setSelectedTable(null)}
        onFocusCamera={() => {
          setSelectedTable({ ...selectedTable });
        }}
      />

      {/* Modal Bảng màu Moodboard & Phân tích Concept */}
      <StyleGuideModal
        isOpen={isStyleGuideOpen}
        onClose={() => setIsStyleGuideOpen(false)}
      />

      {/* Modal Xuất Prompt Render 3D AI */}
      <PromptGeneratorModal
        isOpen={isPromptGeneratorOpen}
        onClose={() => setIsPromptGeneratorOpen(false)}
      />
    </div>
  );
}
