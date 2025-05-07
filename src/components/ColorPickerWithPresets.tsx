import React, { useState } from "react";
import { RgbaStringColorPicker } from "react-colorful";

const PRESET_COLORS = [
  "#FF4B4B",
  "#F59E0B",
  "#FACC15",
  "#22C55E",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#6B7280",
  "#DDBEF4",
  "#F4EEBE",
  "#BEF4E8",
];

interface ColorPickerWithPresetsProps {
  color: string;
  onChange: (color: string) => void;
}

const ColorPickerWithPresets: React.FC<ColorPickerWithPresetsProps> = ({
  color,
  onChange,
}) => {
  const [showCustomPicker, setShowCustomPicker] = useState<boolean>(false);

  const handlePresetClick = (preset: string) => {
    onChange(preset);
    setShowCustomPicker(false);
  };

  return (
    <div className="color-picker-wrapper">
      <h3>Pick list color</h3>
      <div className="swatch-grid">
        {PRESET_COLORS.map((preset) => (
          <button
            key={preset}
            className={`color-swatch ${color === preset ? "selected" : ""}`}
            style={{ backgroundColor: preset }}
            onClick={() => handlePresetClick(preset)}
            aria-label={`Select color ${preset}`}
          />
        ))}
        <button
          className={`color-swatch custom ${
            showCustomPicker ? "selected" : ""
          }`}
          onClick={() => setShowCustomPicker(!showCustomPicker)}
        >
          +
        </button>
      </div>

      {showCustomPicker && (
        <div className="custom-picker">
          <RgbaStringColorPicker color={color} onChange={onChange} />
        </div>
      )}
    </div>
  );
};

export default ColorPickerWithPresets;
