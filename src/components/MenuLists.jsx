import React from "react";

// const MenuLists = ({ lists }) => {
const MenuLists = ({ lists }) => {
  return (
    <div>
      <h3>Lists</h3>
      {lists.map((list, index) => {
        return (
          <div className="menu-list" key={index}>
            <span
              className="menu-list-color-block"
              style={{ backgroundColor: list.color }}
            ></span>
            <span className="menu-list-name">{list.name}</span>
            <span className="menu-list-item-count">{list.count}</span>
          </div>
        );
      })}
    </div>
  );
};

export default MenuLists;
