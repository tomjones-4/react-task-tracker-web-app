import Tooltip from "./Tooltip";

interface ToggleSwitchProps {
  checked: boolean;
  onCheckedChange: () => void;
  label?: string;
  tooltipText?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onCheckedChange,
  label = "Toggle",
  tooltipText = null,
}) => {
  return (
    <div className="switch-container">
      <span className="switch-label">
        <b>{label}</b>
        {tooltipText && <Tooltip text={tooltipText} />}
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
