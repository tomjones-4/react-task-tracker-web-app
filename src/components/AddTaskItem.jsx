import React from "react";
import { FaPlus } from "react-icons/fa";

const AddTaskItem = ({ resetTask }) => {
  return (
    <span className="add-task-item" onClick={resetTask}>
      <FaPlus className="add-task-icon" />
      <p className="add-task-text">Add New Item</p>
    </span>
  );
};

export default AddTaskItem;
