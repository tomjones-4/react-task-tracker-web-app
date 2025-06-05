interface ToggleSwitchProps {
  checked: boolean;
  onCheckedChange: () => void;
  label?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onCheckedChange,
  label = "Toggle",
}) => {
  return (
    <div className="switch-container">
      <span className="switch-label">
        <b>{label}</b>
      </span>
      <div
        className={`switch ${checked ? "switch-on" : ""}`}
        onClick={onCheckedChange}
      >
        <div className="switch-handle" />
      </div>
    </div>
  );
};

export default ToggleSwitch;
