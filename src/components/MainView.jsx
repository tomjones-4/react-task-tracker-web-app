import TodoList from "./TodoList";

const MainView = ({
  tasks,
  setTasks,
  setSelectedTask,
  deleteTask,
  addTask,
  toggleCompleted,
  text,
  setText,
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
        text={text}
        setText={setText}
      />
    </div>
  );
};

export default MainView;
