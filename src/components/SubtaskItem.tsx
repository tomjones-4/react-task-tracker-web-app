import React, { useState } from "react";
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
  //   selectedSubtaskId: number | undefined;
  //   setSelectedSubtask: React.Dispatch<React.SetStateAction<Subtask | undefined>>;
  //   ripple: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const SubtaskItem: React.FC<SubtaskItemProps> = ({
  subtask,
  toggleSubtaskCompleted,
  editSubtask,
  deleteSubtask,

  //   selectedSubtaskId,
  //   setSelectedSubtask,
  //   ripple,
}) => {
  //   const handleSubtaskClick = (e: React.MouseEvent<HTMLDivElement>) => {
  //     // setSelectedSubtask(subtask);
  //     // setIsAddMode(false);
  //     ripple(e);
  //   };

  const [subtaskTitle, setSubtaskTitle] = useState<string>(subtask.title);

  const handleChange = () => {
    toggleSubtaskCompleted(subtask.id);
  };

  const handleUpdateSubtask = (
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLInputElement>,
    editedSubtaskTitle: string
  ) => {
    e.preventDefault();
    const editedSubtask: Subtask = {
      ...subtask,
      title: editedSubtaskTitle,
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

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: subtask.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div
        // className={`task-item ${subtask.completed ? "completed" : ""} ${
        //   subtask.id == selectedSubtaskId ? "selected" : ""
        // }`}
        className={`task-item ${subtask.completed ? "completed" : ""}`}
        // onClick={handleSubtaskClick}
      >
        <input
          className="subtask-checkbox"
          type="checkbox"
          checked={subtask.completed}
          onChange={handleChange}
        />
        <input
          className="subtask-input"
          ref={undefined} // TODO - fill this out if needed
          type="text"
          placeholder="Add New Subtask"
          value={subtaskTitle}
          onChange={(e) => setSubtaskTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleUpdateSubtask(e, subtaskTitle);
              e.currentTarget.blur();
            }
          }}
        ></input>
        <span className="subtask-actions">
          <button
            type="button"
            className="icon-button save"
            onClick={(e) => handleUpdateSubtask(e, subtaskTitle)}
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
        {/* TODO - make a delete button for subtasks */}
        {/* <button onClick={() => deleteTask(task.id)}>X</button> */}

        {/* <span className="ripple" /> */}
      </div>
    </div>
  );
};

export default SubtaskItem;
