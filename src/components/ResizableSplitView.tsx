import React, { useRef, useState, useEffect, ReactNode } from "react";

interface ResizableSplitViewProps {
  left: ReactNode;
  right: ReactNode;
}

const ResizableSplitView: React.FC<ResizableSplitViewProps> = ({
  left,
  right,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [leftWidth, setLeftWidth] = useState(50); // Percentage

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const offsetX = e.clientX - containerRect.left;
      const containerWidth = containerRect.width;
      const newLeftWidth = (offsetX / containerWidth) * 100;

      setLeftWidth(Math.max(10, Math.min(newLeftWidth, 90)));
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    const handleMouseDown = () => {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    const resizer = document.getElementById("resizer");
    resizer?.addEventListener("mousedown", handleMouseDown);

    return () => {
      resizer?.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  return (
    <div className="split-container" ref={containerRef}>
      <div className="split-pane left-pane" style={{ width: `${leftWidth}%` }}>
        {left}
      </div>
      <div id="resizer" className="resizer">
        <div className="resizer-handle" />
      </div>
      <div
        className="split-pane right-pane"
        style={{ width: `${100 - leftWidth}%` }}
      >
        {right}
      </div>
    </div>
  );
};

export default ResizableSplitView;
