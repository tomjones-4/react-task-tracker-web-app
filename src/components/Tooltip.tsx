import React, { useEffect } from "react";
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
  const [tooltipDirection, setTooltipDirection] = React.useState<
    "left" | "right"
  >("right");

  useEffect(() => {
    if (show && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const iconCenterX = rect.left + rect.width / 2;
      const screenCenterX = window.innerWidth / 2;

      const tooltipToLeft = iconCenterX > screenCenterX;

      const top = rect.top + rect.height / 2;
      const left = tooltipToLeft ? rect.left - 8 : rect.right + 8;

      setPosition({ top, left });
      setTooltipDirection(tooltipToLeft ? "left" : "right");
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
            className={`tooltip-text-portal tooltip-${tooltipDirection}`}
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
