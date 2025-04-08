import React from "react";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";

const AddTodoItem = ({ resetTask }) => {
  //   return (
  //     <div className="add-todo-item">
  //       <button className="add-todo-btn" onClick={() => addTask(text)}>
  //         +
  //       </button>
  //       <input
  //         type="text"
  //         value={text}
  //         className="todo-input"
  //         placeholder="Add New Task"
  //         onChange={(e) => setText(e.target.value)}
  //       ></input>
  //     </div>
  //   );

  return (
    <span className="add-todo-item" onClick={resetTask}>
      <FaPlus />
      <p>Add New Item</p>
    </span>
  );
};

export default AddTodoItem;
