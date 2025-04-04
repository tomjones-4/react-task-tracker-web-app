import TodoForm from "./TodoForm";
import { useState } from "react";

const TaskView = ({
  selectedTask,
  lists,
  deleteTask,
  addTask,
  taskText,
  setTaskText,
}) => {
  return (
    <div>
      <h1>Task</h1>
      <h2>{selectedTask.text}</h2>
      <TodoForm lists={lists} taskText={taskText} setTaskText={setTaskText} />
      <div className="task-buttons">
        <h3>Task Details</h3>
        <p>{selectedTask.completed ? "Completed" : "Not Completed"}</p>
        <button onClick={() => deleteTask(selectedTask.id)}>Delete task</button>
        <button onClick={() => addTask(taskText)}>Save changes</button>
      </div>
    </div>
  );
};

export default TaskView;
