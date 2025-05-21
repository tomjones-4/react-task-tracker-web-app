import React from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { IoIosLogOut } from "react-icons/io";
import ToggleSwitch from "./ToggleSwitch";

interface MenuFooterProps {
  showCalendarView: boolean;
  setShowCalendarView: React.Dispatch<React.SetStateAction<boolean>>;
}

const MenuFooter: React.FC<MenuFooterProps> = ({
  showCalendarView,
  setShowCalendarView,
}) => {
  return (
    <div className="menu-footer">
      <ToggleSwitch
        checked={showCalendarView}
        onCheckedChange={setShowCalendarView}
        label="Show Calendar View"
      />
      {/* TODO - change the checked and onCheckedChange props to the correct ones */}
      <ToggleSwitch
        checked={showCalendarView}
        onCheckedChange={setShowCalendarView}
        label="Hide completed tasks"
      />
      <ToggleSwitch
        checked={showCalendarView}
        onCheckedChange={setShowCalendarView}
        label="Dark mode"
      />
      {/* <span>
        <IoSettingsOutline className="menu-footer-icon" />
        <p>Settings - Coming soon...</p>
      </span>
      <span>
        <IoIosLogOut className="menu-footer-icon" />
        <p>Sign out - Coming soon...</p>
      </span> */}
    </div>
  );
};

export default MenuFooter;
