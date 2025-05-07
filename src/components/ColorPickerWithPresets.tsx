import React, { useState } from "react";
import { RgbaStringColorPicker } from "react-colorful";

const PRESET_COLORS = [
  "#FF4C4C", // bright red
  "#FF9900", // orange
  "#FFD700", // golden yellow
  "#66DD00", // lime green
  "#00CC66", // emerald green
  "#00CFCF", // aqua / teal
  "#3399FF", // sky blue
  "#3366FF", // royal blue
  "#9966FF", // violet
  "#FF33CC", // magenta
  "#FF3399", // hot pink
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
