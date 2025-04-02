import React from "react";

function TodoItem({ task, deleteTask, toggleCompleted, setSelectedTask }) {
  const handleClick = () => {
    setSelectedTask(task);
  };

  function handleChange() {
    toggleCompleted(task.id);
  }

  return (
    <div className={`todo-item ${task.completed ? "completed" : ""}`}>
      <input type="checkbox" checked={task.completed} onChange={handleChange} />
      <p>{task.text}</p>
      <button onClick={() => deleteTask(task.id)}>X</button>
      <button onClick={() => handleClick()}>+</button>
    </div>
  );
}

export default TodoItem;
