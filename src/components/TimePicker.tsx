import { useState } from "react";
import { Time } from "../types";

interface TimePickerProps {
  value: Time | null;
  // onChange: (newHour: number, newMinute: number, newAmpm: string) => void;
  onChange: (newTime: Time) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({ value, onChange }) => {
  const [hour, setHour] = useState<number>(value?.hour || 12);
  const [minute, setMinute] = useState<number>(value?.minute || 0);
  const [ampm, setAmpm] = useState<string>(value?.ampm || "AM");

  const handleChange = (
    newHour: number,
    newMinute: number,
    newAmpm: string
  ) => {
    const updated: Time = { hour: newHour, minute: newMinute, ampm: newAmpm };
    onChange(updated);
  };

  return (
    <div className="time-picker">
      <select
        value={hour}
        onChange={(e) => {
          setHour(parseInt(e.target.value));
          handleChange(parseInt(e.target.value), minute, ampm);
        }}
      >
        {Array.from({ length: 12 }, (_, i) => {
          const h = String(i + 1);
          return (
            <option key={h} value={h}>
              {h}
            </option>
          );
        })}
      </select>

      <span>:</span>

      <select
        value={minute}
        onChange={(e) => {
          setMinute(parseInt(e.target.value));
          handleChange(hour, parseInt(e.target.value), ampm);
        }}
      >
        {Array.from({ length: 60 }, (_, i) => {
          const m = i.toString().padStart(2, "0");
          return (
            <option key={m} value={m}>
              {m}
            </option>
          );
        })}
      </select>

      <select
        value={ampm}
        onChange={(e) => {
          setAmpm(e.target.value);
          handleChange(hour, minute, e.target.value);
        }}
      >
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  );
};

export default TimePicker;
