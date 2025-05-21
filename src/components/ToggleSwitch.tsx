import * as Switch from "@radix-ui/react-switch";

interface ToggleSwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onCheckedChange,
  label = "Toggle",
}) => {
  return (
    <div className="toggle-switch">
      <label className="toggle-label">
        <b>{label}</b>
      </label>
      <Switch.Root
        className="switch-root"
        checked={checked}
        onCheckedChange={onCheckedChange}
      >
        <Switch.Thumb className="switch-thumb" />
      </Switch.Root>
    </div>
  );
};

export default ToggleSwitch;
