import React from "react";
import ReactDOM from "react-dom";
import { FaInfoCircle } from "react-icons/fa";

interface TooltipProps {
  text: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ text }) => {
  const tooltipRoot = document.getElementById("tooltip-root");
  const [show, setShow] = React.useState(false);
  const ref = React.useRef<HTMLSpanElement | null>(null);
  const [position, setPosition] = React.useState({ top: 0, left: 0 });

  React.useEffect(() => {
    if (show && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setPosition({ top: rect.top - 40, left: rect.left + rect.width / 2 });
    }
  }, [show]);

  return (
    <>
      <span
        ref={ref}
        className="tooltip-trigger"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        <span>
          <FaInfoCircle />
        </span>
      </span>
      {show &&
        tooltipRoot &&
        ReactDOM.createPortal(
          <div
            className="tooltip-text-portal"
            style={{ top: position.top, left: position.left }}
          >
            {text}
          </div>,
          tooltipRoot
        )}
    </>
  );
};

export default Tooltip;
