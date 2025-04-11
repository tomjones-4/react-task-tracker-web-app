import React from "react";
import MenuLists from "./MenuLists";
import { IoSettingsOutline } from "react-icons/io5";
import { IoIosLogOut } from "react-icons/io";

const Menu = ({ lists }) => {
  return (
    <div className="menu-container">
      <h1>Menu</h1>
      <div className="search-container">
        <span className="search-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </span>
        <input
          type="text"
          className="search-input"
          placeholder="Search"
        ></input>
      </div>
      <MenuLists lists={lists} />
      <div className="menu-footer">
        <span>
          <IoSettingsOutline className="menu-footer-icon" />
          <p>Settings</p>
        </span>
        <span>
          <IoIosLogOut className="menu-footer-icon" />
          <p>Sign out</p>
        </span>
      </div>
    </div>
  );
};

export default Menu;
