import React, { useRef, forwardRef, useImperativeHandle } from "react";
import MenuLists from "./MenuLists";
import { List, Tag } from "../types";
import MenuFooter from "./MenuFooter";
import MenuTags from "./MenuTags";
import SearchContainer from "./SearchContainer";

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
  hideCompletedTasks: boolean;
  setHideCompletedTasks: React.Dispatch<React.SetStateAction<boolean>>;
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  automaticSorting: boolean;
  setAutomaticSorting: React.Dispatch<React.SetStateAction<boolean>>;
  tags: Tag[];
  addTag: (newTag: Tag) => void;
  deleteTag: (tagId: number) => void;
  selectedTagIds: number[];
  setSelectedTagIds: React.Dispatch<React.SetStateAction<number[]>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

export type SearchContainerRef = {
  focusSearchInput: () => void;
};

const Menu = forwardRef<SearchContainerRef, MenuProps>(
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
      hideCompletedTasks,
      setHideCompletedTasks,
      darkMode,
      setDarkMode,
      automaticSorting,
      setAutomaticSorting,
      tags,
      addTag,
      deleteTag,
      selectedTagIds,
      setSelectedTagIds,
      searchQuery,
      setSearchQuery,
    },
    ref
  ) => {
    return (
      <div className="menu-container">
        <h1>Menu</h1>
        <SearchContainer
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          ref={ref}
        />
        <MenuLists
          lists={lists}
          setLists={setLists}
          addList={addList}
          deleteList={deleteList}
          selectedListId={selectedListId}
          changeSelectedList={changeSelectedList}
          ripple={ripple}
        />
        <MenuTags
          tags={tags}
          addTag={addTag}
          deleteTag={deleteTag}
          selectedTagIds={selectedTagIds}
          setSelectedTagIds={setSelectedTagIds}
        />
        <MenuFooter
          showCalendarView={showCalendarView}
          setShowCalendarView={setShowCalendarView}
          hideCompletedTasks={hideCompletedTasks}
          setHideCompletedTasks={setHideCompletedTasks}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          automaticSorting={automaticSorting}
          setAutomaticSorting={setAutomaticSorting}
        />
      </div>
    );
  }
);

export default Menu;
