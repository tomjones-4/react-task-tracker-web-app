import React from "react";
import { FaPlus } from "react-icons/fa";

type AddTaskItemProps = {
  handleStartNewTask: (e: React.MouseEvent<HTMLDivElement>) => void;
};

const AddTaskItem: React.FC<AddTaskItemProps> = ({ handleStartNewTask }) => {
  return (
    <div className="add-task" onClick={handleStartNewTask}>
      <FaPlus className="add-task-icon" />
      <p>Add New Task</p>
      <span className="ripple" />
    </div>
  );
};

export default AddTaskItem;
