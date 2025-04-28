import React from "react";
import { FaChevronRight } from "react-icons/fa";

const TaskItem = ({
  task,
  selectedTaskId,
  //deleteTask,
  toggleCompleted,
  setSelectedTask,
  setIsAddMode,
}) => {
  const handleClick = () => {
    setSelectedTask(task);
    setIsAddMode(false);
  };

  const handleTaskClick = (e) => {
    setSelectedTask(task);
    setIsAddMode(false);

    const target = e.currentTarget;
    const ripple = target.querySelector(".ripple");

    // Get click coordinates relative to the target element
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Position the ripple at the click point
    ripple.style.top = `${y}px`;
    ripple.style.left = `${x}px`;

    // Reset the ripple animation
    ripple.classList.remove("ripple-animate");
    void ripple.offsetWidth; // reflow to restart animation
    ripple.classList.add("ripple-animate");
  };

  const handleChange = () => {
    toggleCompleted(task.id);
  };

  return (
    <div
      className={`task-item ${task.completed ? "completed" : ""} ${
        task.id == selectedTaskId ? "selected" : ""
      }`}
      // onClick={handleClick}
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
