import React from "react";
import MenuLists from "./MenuLists";

const Menu = ({ lists }) => {
  return (
    <div className="menu-container">
      <h2>Menu</h2>
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
    </div>
  );
};

export default Menu;
