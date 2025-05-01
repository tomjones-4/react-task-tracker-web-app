import React from "react";
import { FaChevronRight } from "react-icons/fa";

const TaskItem = ({
  task,
  selectedTaskId,
  //deleteTask,
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

  return (
    <div
      className={`task-item ${task.completed ? "completed" : ""} ${
        task.id == selectedTaskId ? "selected" : ""
      }`}
      onClick={(e) => handleTaskClick(e)}
    >
      <input type="checkbox" checked={task.completed} onChange={handleChange} />
      <p>{task.title}</p>
      {/* <button onClick={() => deleteTask(task.id)}>X</button> */}

      <FaChevronRight className="expand-task-icon" />
      <span className="ripple" />
    </div>
  );
};

export default TaskItem;
