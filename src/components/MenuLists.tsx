import React from "react";
import AddList from "./AddList";
import { List } from "../types";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  verticalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import MenuListItem from "./MenuListItem";

type MenuListsProps = {
  lists: List[];
  setLists: React.Dispatch<React.SetStateAction<List[]>>;
  addList: (newList: List) => void;
  deleteList: (listId: number) => void;
  selectedListId: number;
  changeSelectedList: (list: List) => void;
  ripple: (e: React.MouseEvent<HTMLDivElement>) => void;
};

const MenuLists: React.FC<MenuListsProps> = ({
  lists,
  setLists,
  addList,
  deleteList,
  selectedListId,
  changeSelectedList,
  ripple,
}) => {
  const handleListClick = (e: React.MouseEvent<HTMLDivElement>, list: List) => {
    changeSelectedList(list);
    ripple(e);
  };

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over) return; //safeguard against null
    if (active.id !== over.id) {
      const oldIndex = lists.findIndex((t) => t.id === active.id);
      const newIndex = lists.findIndex((t) => t.id === over.id);
      setLists((lists) => arrayMove(lists, oldIndex, newIndex));
    }
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
      <div className="menu-lists">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={lists.map((list) => list.id)}
            strategy={verticalListSortingStrategy}
          >
            {lists.map((list) => (
              <MenuListItem
                key={list.id}
                list={list}
                isSelected={selectedListId == list.id}
                handleListClick={handleListClick}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default MenuLists;
