import React from "react";
import { Subtask } from "../types";
import { FaGripVertical } from "react-icons/fa";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ExpandedSubtaskItemProps {
  subtask: Subtask;
  toggleSubtaskCompleted: (subtaskId: number) => void;
}

const ExpandedSubtaskItem: React.FC<ExpandedSubtaskItemProps> = ({
  subtask,
  toggleSubtaskCompleted,
}) => {
  const handleChange = () => {
    toggleSubtaskCompleted(subtask.id);
  };

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: subtask.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div
        className={`task-item expanded-subtask-item ${
          subtask.completed ? "completed" : ""
        }`}
      >
        <input
          className="subtask-checkbox"
          type="checkbox"
          checked={subtask.completed}
          onChange={handleChange}
        />
        <p>{subtask.title}</p>
        <span {...listeners} className="drag-handle">
          <FaGripVertical onClick={(e) => e.stopPropagation()} />
        </span>
      </div>
    </div>
  );
};

export default ExpandedSubtaskItem;
