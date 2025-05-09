import React from "react";
import { Subtask } from "../types";
import { FaGripVertical } from "react-icons/fa";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SubtaskItemProps {
  subtask: Subtask;
  //   selectedSubtaskId: number | undefined;
  //   setSelectedSubtask: React.Dispatch<React.SetStateAction<Subtask | undefined>>;
  toggleSubtaskCompleted: (subtaskId: number) => void;
  //   setIsAddMode: React.Dispatch<React.SetStateAction<boolean>>;
  //   ripple: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const SubtaskItem: React.FC<SubtaskItemProps> = ({
  subtask,
  //   selectedSubtaskId,
  //   setSelectedSubtask,
  toggleSubtaskCompleted,
  //   setIsAddMode,
  //   ripple,
}) => {
  //   const handleSubtaskClick = (e: React.MouseEvent<HTMLDivElement>) => {
  //     // setSelectedSubtask(subtask);
  //     // setIsAddMode(false);
  //     ripple(e);
  //   };

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
        // className={`task-item ${subtask.completed ? "completed" : ""} ${
        //   subtask.id == selectedSubtaskId ? "selected" : ""
        // }`}
        className={`task-item ${subtask.completed ? "completed" : ""}`}
        // onClick={handleSubtaskClick}
      >
        <span {...listeners} className="drag-handle">
          <FaGripVertical />
        </span>
        <input
          type="checkbox"
          checked={subtask.completed}
          onChange={handleChange}
        />
        <p>{subtask.title}</p>
        {/* TODO - make a delete button for subtasks */}
        {/* <button onClick={() => deleteTask(task.id)}>X</button> */}

        {/* <span className="ripple" /> */}
      </div>
    </div>
  );
};

export default SubtaskItem;
