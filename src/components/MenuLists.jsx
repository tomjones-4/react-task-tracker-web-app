import React from "react";

// const MenuLists = ({ lists }) => {
const MenuLists = ({ lists }) => {
  return (
    <div className="menu-lists-container">
      <h3>Lists</h3>
      {lists.map((list, index) => {
        return (
          <div className="menu-task-list" key={index}>
            <span
              className="color-block"
              style={{ backgroundColor: list.color }}
            ></span>
            <span className="list-name">{list.name}</span>
            <span className="item-count">{list.length}</span>
          </div>
        );
      })}
    </div>
  );
};

export default MenuLists;
