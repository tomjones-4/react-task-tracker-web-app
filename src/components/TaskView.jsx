import React from "react";

const TaskView = ({ selectedTask }) => {
  return (
    <div>
      <h1>TaskView</h1>
      <h2>{selectedTask.text}</h2>
    </div>
  );
};

export default TaskView;
