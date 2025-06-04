import React from "react";
import { CalendarEvent } from "../types";
import { ToolbarProps, View } from "react-big-calendar";

const CalendarToolbar: React.FC<ToolbarProps<CalendarEvent>> = ({
  date,
  label,
  onNavigate,
  onView,
  view,
}) => {
  const handleNavigate = (action: "TODAY" | "PREV" | "NEXT") => () => {
    onNavigate(action);
  };

  const handleViewChange = (newView: View) => () => {
    onView(newView);
  };

  return (
    <div className="calendar-toolbar">
      <div className="toolbar-section">
        <button className="toolbar-btn" onClick={handleNavigate("TODAY")}>
          Today
        </button>
        <button className="toolbar-btn" onClick={handleNavigate("PREV")}>
          &#8592;
        </button>
        <button className="toolbar-btn" onClick={handleNavigate("NEXT")}>
          &#8594;
        </button>
      </div>
      <div className="toolbar-label">{label}</div>
      <div className="toolbar-section">
        {(["month", "week", "day"] as View[]).map((v) => (
          <button
            key={v}
            onClick={handleViewChange(v)}
            className={`toolbar-btn ${view === v ? "active" : ""}`}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CalendarToolbar;
