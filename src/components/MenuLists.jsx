import React from "react";
import AddList from "./AddList";
import { FaGripVertical } from "react-icons/fa";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import MenuListItem from "./MenuListItem";

const MenuLists = ({
  lists,
  setLists,
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

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
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
              list={list}
              isSelected={selectedListId == list.id}
              handleListClick={handleListClick}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default MenuLists;
