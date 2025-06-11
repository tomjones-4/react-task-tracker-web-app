import { useEffect, useState } from "react";
import { Time } from "../types";

interface TimePickerProps {
  value: Time;
  onChange: (newTime: Time) => void;
  disabled: boolean;
}

const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  disabled,
}) => {
  const [hour, setHour] = useState<number>(value?.hour || 12);
  const [minute, setMinute] = useState<number>(value?.minute || 0);
  const [ampm, setAmpm] = useState<string>(value?.ampm || "AM");

  const handleChange = (
    newHour: number,
    newMinute: number,
    newAmpm: string
  ) => {
    const updatedTime: Time = {
      hour: newHour,
      minute: newMinute,
      ampm: newAmpm,
    };
    onChange(updatedTime);
  };

  useEffect(() => {
    setHour(value?.hour || 12);
    setMinute(value?.minute || 0);
    setAmpm(value?.ampm || "AM");
  }, [value]);

  return (
    <div className="time-picker">
      <select
        value={hour}
        onChange={(e) => {
          setHour(parseInt(e.target.value));
          handleChange(parseInt(e.target.value), minute, ampm);
        }}
        disabled={disabled}
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
        value={minute.toString().padStart(2, "0")}
        onChange={(e) => {
          setMinute(parseInt(e.target.value));
          handleChange(hour, parseInt(e.target.value), ampm);
        }}
        disabled={disabled}
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
        disabled={disabled}
      >
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  );
};

export default TimePicker;
