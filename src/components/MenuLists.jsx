import React from "react";

const MenuLists = ({ lists, selectedListId, changeSelectedList }) => {
  return (
    <div>
      <h3>Lists</h3>
      {lists.map((list) => {
        return (
          <div
            className={`menu-list ${
              selectedListId == list.id ? "selected" : ""
            }`}
            key={list.id}
            onClick={() => changeSelectedList(list)}
          >
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
