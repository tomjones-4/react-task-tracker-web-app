import React from "react";
import { List } from "../types";
import { FaGripVertical } from "react-icons/fa";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type MenuListItemProps = {
  list: List;
  isSelected: boolean;
  handleListClick: (e: React.MouseEvent<HTMLDivElement>, list: List) => void;
};

const MenuListItem: React.FC<MenuListItemProps> = ({
  list,
  isSelected,
  handleListClick,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: list.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div
        className={`menu-list ${isSelected ? "selected" : ""}`}
        key={list.id}
        onClick={(e) => handleListClick(e, list)}
      >
        <span
          className="menu-list-color-block"
          style={{ backgroundColor: list.color }}
        ></span>
        <span className="menu-list-name">{list.name}</span>
        <span {...listeners} className="drag-handle">
          <FaGripVertical />
        </span>
        <span className="menu-list-item-count">{list.taskIds.length}</span>
        <span className="ripple" />
      </div>
    </div>
  );
};

export default MenuListItem;
