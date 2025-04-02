import React from "react";
import TodoForm from "./TodoForm";

const TaskView = ({ selectedTask, lists }) => {
  return (
    <div>
      <h1>Task</h1>
      <h2>{selectedTask.text}</h2>
      <TodoForm lists={lists} />
    </div>
  );
};

export default TaskView;
