import React from "react";

const MenuLists = ({ lists, selectedListId, changeSelectedList }) => {
  const handleListClick = (e, list) => {
    changeSelectedList(list);
    const target = e.currentTarget;
    const ripple = target.querySelector(".ripple");

    // Get click coordinates relative to the target element
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Position the ripple at the click point
    ripple.style.top = `${y}px`;
    ripple.style.left = `${x}px`;

    // Reset the ripple animation
    ripple.classList.remove("ripple-animate");
    void ripple.offsetWidth; // reflow to restart animation
    ripple.classList.add("ripple-animate");
  };

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
