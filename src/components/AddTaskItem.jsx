import React from "react";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";

const AddTaskItem = ({ resetTask }) => {
  return (
    <span className="add-task-item" onClick={resetTask}>
      <FaPlus />
      <p>Add New Item</p>
    </span>
  );
};

export default AddTaskItem;
