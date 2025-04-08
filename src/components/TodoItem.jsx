import React from "react";

const TodoItem = ({
  task,
  deleteTask,
  toggleCompleted,
  changeSelectedTask,
}) => {
  const handleClick = () => {
    changeSelectedTask(task);
  };

  const handleChange = () => {
    toggleCompleted(task.id);
  };

  return (
    <div
      className={`todo-item ${task.completed ? "completed" : ""}`}
      onClick={handleClick}
    >
      <input type="checkbox" checked={task.completed} onChange={handleChange} />
      <p>{task.text}</p>
      <button onClick={() => deleteTask(task.id)}>X</button>
    </div>
  );
};

export default TodoItem;
