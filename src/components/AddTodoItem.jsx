import React from "react";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";

const AddTodoItem = ({ addTask, setTaskText }) => {
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

  const testFn = () => {
    console.log("click worked at least");
    setTaskText("");
  };

  return (
    <span className="add-todo-item" onClick={testFn}>
      <FaPlus />
      <p>Add New Item</p>
    </span>
  );
};

export default AddTodoItem;
