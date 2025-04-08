import TodoForm from "./TodoForm";

const TaskView = ({ selectedTask, lists, deleteTask, addTask, editTask }) => {
  const testAddTask = (taskTitle) => {
    console.log(`OK - taskTitle =  ${taskTitle.toString()}`);
  };

  return (
    <div>
      <h1>Task</h1>
      <TodoForm lists={lists} selectedTask={selectedTask} />
      <div className="task-buttons">
        <h3>Task Details</h3>
        <p>{selectedTask.completed ? "Completed" : "Not Completed"}</p>
        <button onClick={() => deleteTask(selectedTask.id)}>Delete task</button>
        {/* <button onClick={() => addTask(selectedTask.text)}>Save changes</button> */}
        <button onClick={() => testAddTask(selectedTask.text)}>
          Save changes
        </button>
      </div>
    </div>
  );
};

export default TaskView;
