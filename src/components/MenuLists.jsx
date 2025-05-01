import React from "react";
import AddList from "./AddList";

const MenuLists = ({
  lists,
  addList,
  deleteList,
  selectedListId,
  changeSelectedList,
  ripple,
}) => {
  const handleListClick = (e, list) => {
    changeSelectedList(list);
    ripple(e);
  };

  return (
    <div>
      <h3>Lists</h3>
      <AddList
        lists={lists}
        addList={addList}
        deleteList={deleteList}
        ripple={ripple}
      />
      {lists.map((list) => {
        return (
          <div
            className={`menu-list ${
              selectedListId == list.id ? "selected" : ""
            }`}
            key={list.id}
            // onClick={() => changeSelectedList(list)}
            onClick={(e) => handleListClick(e, list)}
          >
            <span
              className="menu-list-color-block"
              style={{ backgroundColor: list.color }}
            ></span>
            <span className="menu-list-name">{list.name}</span>
            <span className="menu-list-item-count">{list.count}</span>
            <span className="ripple" />
          </div>
        );
      })}
    </div>
  );
};

export default MenuLists;
