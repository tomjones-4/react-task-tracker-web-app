import React from "react";
import { FaPlus } from "react-icons/fa";

const AddList = () => {
  return (
    // <span className="add-task" onClick={resetTask}>
    <span className="add-list">
      <FaPlus className="add-list-icon" />
      <p>Add New Task</p>
    </span>
  );
};

export default AddList;
