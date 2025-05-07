import React, { useState } from "react";
import { RgbaStringColorPicker } from "react-colorful";
interface ColorPickerWithPresetsProps {
  color: string;
  setColor: (color: string) => void;
  presetColors: string[];
}

const ColorPickerWithPresets: React.FC<ColorPickerWithPresetsProps> = ({
  color,
  setColor,
  presetColors,
}) => {
  const [showCustomPicker, setShowCustomPicker] = useState<boolean>(false);

  const handlePresetClick = (preset: string) => {
    setColor(preset);
    setShowCustomPicker(false);
  };

  return (
    <div className="color-picker-wrapper">
      <h3>Pick list color</h3>
      <div className="swatch-grid">
        {presetColors.map((preset) => (
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
          <RgbaStringColorPicker color={color} onChange={setColor} />
        </div>
      )}
    </div>
  );
};

export default ColorPickerWithPresets;
