import React from "react";
import { useState } from "react";

const AddTodoItem = ({ setTasks, tasks }) => {
  const [text, setText] = useState("");

  const addTask = (text) => {
    if (!text) return; // Prevent adding empty tasks
    const newTask = {
      id: Date.now(),
      text,
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setText("");
  };

  return (
    <div className="add-todo-item">
      <button className="add-todo-btn" onClick={() => addTask(text)}>
        +
      </button>
      <input
        type="text"
        value={text}
        className="todo-input"
        placeholder="Add New Task"
        onChange={(e) => setText(e.target.value)}
      ></input>
    </div>
  );
};

export default AddTodoItem;
