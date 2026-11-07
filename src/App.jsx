import React, { useState } from 'react';
import Scene from './components/Scene';
import ControlOverlay from './ui/ControlOverlay';
import TableModal from './ui/TableModal';
import StyleGuideModal from './ui/StyleGuideModal';
import PromptGeneratorModal from './ui/PromptGeneratorModal';
import { TABLES_LIST } from './constants/layoutData';

export default function App() {
  const [activePresetId, setActivePresetId] = useState('overview');
  const [lightMode, setLightMode] = useState('ceremony'); // 'ceremony' | 'reception'
  const [selectedTable, setSelectedTable] = useState(null);
  const [isAutoRotate, setIsAutoRotate] = useState(false);
  const [showTableNumbers, setShowTableNumbers] = useState(true);
  const [enableBloom, setEnableBloom] = useState(true);
  const [isStyleGuideOpen, setIsStyleGuideOpen] = useState(false);
  const [isPromptGeneratorOpen, setIsPromptGeneratorOpen] = useState(false);
  const [isCinematicTour, setIsCinematicTour] = useState(false);

  // Toggle lighting mode
  const handleToggleLightMode = () => {
    setLightMode((prev) => (prev === 'ceremony' ? 'reception' : 'ceremony'));
  };

  // Chọn preset camera
  const handleSelectPreset = (presetId) => {
    setIsCinematicTour(false);
    setActivePresetId(presetId);
    if (presetId !== 'table') {
      setSelectedTable(null);
    } else {
      setSelectedTable(TABLES_LIST[0]);
    }
  };

  // Chọn bàn tiệc
  const handleSelectTable = (table) => {
    setIsCinematicTour(false);
    setSelectedTable(table);
  };

  // Toggle Cinematic Tour
  const handleToggleCinematicTour = () => {
    setIsCinematicTour((prev) => !prev);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#100E14] font-sans">
      {/* 3D WebGL Canvas Scene */}
      <Scene
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

      {/* Modal Xuất Prompt Render 3D AI (Midjourney / Flux) */}
      <PromptGeneratorModal
        isOpen={isPromptGeneratorOpen}
        onClose={() => setIsPromptGeneratorOpen(false)}
      />
    </div>
  );
}
