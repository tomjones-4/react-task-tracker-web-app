import React from "react";
import { FaChevronRight, FaGripVertical } from "react-icons/fa";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const TaskItem = ({
  task,
  selectedTaskId,
  toggleCompleted,
  setSelectedTask,
  setIsAddMode,
  ripple,
}) => {
  const handleTaskClick = (e) => {
    setSelectedTask(task);
    setIsAddMode(false);
    ripple(e);
  };

  const handleChange = () => {
    toggleCompleted(task.id);
  };

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div
        className={`task-item ${task.completed ? "completed" : ""} ${
          task.id == selectedTaskId ? "selected" : ""
        }`}
        onClick={handleTaskClick}
      >
        <span {...listeners} className="drag-handle">
          <FaGripVertical />
        </span>
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleChange}
        />
        <p>{task.title}</p>
        {/* <button onClick={() => deleteTask(task.id)}>X</button> */}

        <FaChevronRight className="expand-task-icon" />
        <span className="ripple" />
      </div>
    </div>
  );
};

export default TaskItem;
