import React, { useState } from "react";
import { RgbaStringColorPicker } from "react-colorful";
import * as Popover from "@radix-ui/react-popover";
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
  const [customColor, setCustomColor] = useState<string>(
    "rgba(128, 128, 128, 1)"
  );

  const handlePresetClick = (preset: string) => {
    setColor(preset);
    setShowCustomPicker(false);
  };

  const handleCustomChange = (newColor: string) => {
    setCustomColor(newColor); // update swatch color
    setColor(newColor); // apply selected color
  };

  return (
    <div className="color-picker-wrapper">
      <h3>Pick color</h3>
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

        <Popover.Root>
          <Popover.Trigger asChild>
            <button
              className={`color-swatch custom ${
                color === customColor ? "selected" : ""
              }`}
              style={{ backgroundColor: customColor }}
              aria-label="Custom color picker"
            >
              +
            </button>
          </Popover.Trigger>

          <Popover.Portal>
            <Popover.Content sideOffset={8} className="popover-content">
              <RgbaStringColorPicker
                color={customColor}
                onChange={handleCustomChange}
              />
              <Popover.Arrow className="popover-arrow" />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
    </div>
  );
};

export default ColorPickerWithPresets;
