import React from "react";
import TodoForm from "./TodoForm";

const TaskView = ({ selectedTask, lists, deleteTask, addTask }) => {
  return (
    <div>
      <h1>Task</h1>
      <h2>{selectedTask.text}</h2>
      <TodoForm lists={lists} />
      <div className="task-buttons">
        <h3>Task Details</h3>
        <p>{selectedTask.completed ? "Completed" : "Not Completed"}</p>
        <button onClick={() => deleteTask(selectedTask.id)}>Delete task</button>
        {/* <button onClick={() => toggleCompleted(task.id)}>Save changes</button> */}
      </div>
    </div>
  );
};

export default TaskView;
