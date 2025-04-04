import TodoList from "./TodoList";

const MainView = ({
  tasks,
  setTasks,
  setSelectedTask,
  deleteTask,
  addTask,
  toggleCompleted,
  setTaskText,
}) => {
  return (
    <div className="main-view">
      <h1>MainView</h1>

      <TodoList
        tasks={tasks}
        setTasks={setTasks}
        setSelectedTask={setSelectedTask}
        deleteTask={deleteTask}
        addTask={addTask}
        toggleCompleted={toggleCompleted}
        setTaskText={setTaskText}
      />
    </div>
  );
};

export default MainView;
