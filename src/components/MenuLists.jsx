import React from "react";

// const MenuLists = ({ lists }) => {
const MenuLists = ({ lists }) => {
  return (
    <div className="sidebar">
      {lists.map((list, index) => {
        return (
          <div className="task-list">
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
