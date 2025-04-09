import React from "react";

const TaskItem = ({ task, deleteTask, toggleCompleted, setSelectedTask }) => {
  const handleClick = () => {
    setSelectedTask(task);
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
      <button onClick={() => deleteTask(task.id)}>X</button>
    </div>
  );
};

export default TaskItem;
