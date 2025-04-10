import React from "react";
import { FaChevronRight } from "react-icons/fa";

const TaskItem = ({
  task,
  deleteTask,
  toggleCompleted,
  setSelectedTask,
  setIsAddMode,
}) => {
  const handleClick = () => {
    setSelectedTask(task);
    setIsAddMode(false);
  };

  const handleChange = () => {
    toggleCompleted(task.id);
  };

  return (
    <div
      className={`task-item ${task.completed ? "completed" : ""}`}
      onClick={handleClick}
    >
      <input type="checkbox" checked={task.completed} onChange={handleChange} />
      <p>{task.title}</p>
      {/* <button onClick={() => deleteTask(task.id)}>X</button> */}
      <FaChevronRight className="expand-task-icon" />
    </div>
  );
};

export default TaskItem;
