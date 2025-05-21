import React, { useRef, forwardRef, useImperativeHandle } from "react";
import MenuLists from "./MenuLists";
import { List } from "../types";
import MenuFooter from "./MenuFooter";

interface MenuProps {
  lists: List[];
  setLists: React.Dispatch<React.SetStateAction<List[]>>;
  addList: (newList: List) => void;
  deleteList: (listId: number) => void;
  selectedListId: number;
  changeSelectedList: (list: List) => void;
  ripple: (e: React.MouseEvent<HTMLDivElement>) => void;
  showCalendarView: boolean;
  setShowCalendarView: React.Dispatch<React.SetStateAction<boolean>>;
}

export type MenuRef = {
  focusSearchInput: () => void;
};

const Menu = forwardRef<MenuRef, MenuProps>(
  (
    {
      lists,
      setLists,
      addList,
      deleteList,
      selectedListId,
      changeSelectedList,
      ripple,
      showCalendarView,
      setShowCalendarView,
    },
    ref
  ) => {
    const searchInputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => ({
      focusSearchInput() {
        searchInputRef.current?.focus();
      },
    }));

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
            ref={searchInputRef}
            type="text"
            className="search-input"
            placeholder="Search - Coming soon..."
          ></input>
        </div>
        <MenuLists
          lists={lists}
          setLists={setLists}
          addList={addList}
          deleteList={deleteList}
          selectedListId={selectedListId}
          changeSelectedList={changeSelectedList}
          ripple={ripple}
        />
        <MenuFooter
          showCalendarView={showCalendarView}
          setShowCalendarView={setShowCalendarView}
        />
      </div>
    );
  }
);

export default Menu;
