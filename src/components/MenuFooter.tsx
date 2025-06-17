import React from "react";
import ToggleSwitch from "./ToggleSwitch";

interface MenuFooterProps {
  showCalendarView: boolean;
  setShowCalendarView: React.Dispatch<React.SetStateAction<boolean>>;
  hideCompletedTasks: boolean;
  setHideCompletedTasks: React.Dispatch<React.SetStateAction<boolean>>;
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  automaticSorting: boolean;
  setAutomaticSorting: React.Dispatch<React.SetStateAction<boolean>>;
}

const MenuFooter: React.FC<MenuFooterProps> = ({
  showCalendarView,
  setShowCalendarView,
  hideCompletedTasks,
  setHideCompletedTasks,
  darkMode,
  setDarkMode,
  automaticSorting,
  setAutomaticSorting,
}) => {
  return (
    <div className="menu-footer">
      <ToggleSwitch
        checked={showCalendarView}
        onCheckedChange={() => setShowCalendarView(!showCalendarView)}
        label="Show Calendar View"
      />
      <ToggleSwitch
        checked={hideCompletedTasks}
        onCheckedChange={() => setHideCompletedTasks(!hideCompletedTasks)}
        label="Hide Completed"
      />
      <ToggleSwitch
        checked={automaticSorting}
        onCheckedChange={() => setAutomaticSorting(!automaticSorting)}
        label="Automatic Sorting"
        tooltipText="Automatically sort tasks based on (1) completion, (2) priority, (3) due date."
      />
      <ToggleSwitch
        checked={darkMode}
        onCheckedChange={() => setDarkMode(!darkMode)}
        label="Dark Mode"
      />
    </div>
  );
};

export default MenuFooter;
