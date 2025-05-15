import React, { useState, useEffect } from "react";
import { Subtask } from "../types";
import { FaGripVertical } from "react-icons/fa";
import { FiCheck, FiX } from "react-icons/fi";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SubtaskItemProps {
  subtask: Subtask;
  toggleSubtaskCompleted: (subtaskId: number) => void;
  editSubtask: (editedSubtask: Subtask) => void;
  deleteSubtask: (subtaskId: number) => void;
  showError: (message: string) => void;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

const SubtaskItem: React.FC<SubtaskItemProps> = ({
  subtask,
  toggleSubtaskCompleted,
  editSubtask,
  deleteSubtask,
  showError,
  setError,
}) => {
  const [subtaskTitle, setSubtaskTitle] = useState<string>(subtask.title);

  const handleChange = () => {
    toggleSubtaskCompleted(subtask.id);
  };

  const handleUpdateSubtask = (
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
    if (!subtaskTitle) {
      showError("Subtask cannot be empty.");
      return;
    }
    const editedSubtask: Subtask = {
      ...subtask,
      title: subtaskTitle,
    };
    editSubtask(editedSubtask);
  };

  const handleDeleteSubtask = (
    e: React.MouseEvent<HTMLButtonElement>,
    subtaskId: number
  ) => {
    e.preventDefault();
    deleteSubtask(subtaskId);
  };

  useEffect(() => {
    if (subtaskTitle) {
      setError("");
    }
  }, [subtaskTitle]);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: subtask.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className={`task-item ${subtask.completed ? "completed" : ""}`}>
        <input
          className="subtask-checkbox"
          type="checkbox"
          checked={subtask.completed}
          onChange={handleChange}
        />
        <input
          className="subtask-input"
          type="text"
          placeholder="Add New Subtask"
          value={subtaskTitle}
          onChange={(e) => setSubtaskTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleUpdateSubtask(e);
              e.currentTarget.blur();
            }
          }}
        ></input>
        <span className="subtask-actions">
          <button
            type="button"
            className="icon-button save"
            onClick={(e) => handleUpdateSubtask(e)}
          >
            <FiCheck size={16} />
          </button>
          <button
            type="button"
            className="icon-button delete"
            onClick={(e) => handleDeleteSubtask(e, subtask.id)}
          >
            <FiX size={16} />
          </button>
        </span>
        <span {...listeners} className="drag-handle">
          <FaGripVertical onClick={(e) => e.stopPropagation()} />
        </span>
      </div>
    </div>
  );
};

export default SubtaskItem;
