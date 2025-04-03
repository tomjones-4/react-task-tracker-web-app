import React from "react";
import { useState } from "react";

const AddTodoItem = ({ addTask, text, setText }) => {
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
