import React from "react";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";

const AddTaskItem = ({ resetTask }) => {
  //   return (
  //     <div className="add-task-item">
  //       <button className="add-task-btn" onClick={() => addTask(text)}>
  //         +
  //       </button>
  //       <input
  //         type="text"
  //         value={text}
  //         className="task-input"
  //         placeholder="Add New Task"
  //         onChange={(e) => setText(e.target.value)}
  //       ></input>
  //     </div>
  //   );

  return (
    <span className="add-task-item" onClick={resetTask}>
      <FaPlus />
      <p>Add New Item</p>
    </span>
  );
};

export default AddTaskItem;
