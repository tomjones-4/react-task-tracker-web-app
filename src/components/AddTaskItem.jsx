import React from "react";
import { FaPlus } from "react-icons/fa";

const AddTaskItem = ({ handleStartNewTask }) => {
  return (
    <div className="add-task" onClick={handleStartNewTask}>
      <FaPlus className="add-task-icon" />
      <p>Add New Task</p>
      <span className="ripple" />
    </div>
  );
};

export default AddTaskItem;
