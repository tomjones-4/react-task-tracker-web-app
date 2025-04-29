import React from "react";
import { FaPlus } from "react-icons/fa";

const AddTaskItem = ({ resetTask }) => {
  return (
    <span className="add-task" onClick={() => resetTask()}>
      <FaPlus className="add-task-icon" />
      <p>Add New Task</p>
    </span>
  );
};

export default AddTaskItem;
