import TodoList from "./TodoList";

const MainView = ({ tasks, setTasks, setSelectedTask }) => {
  return (
    <div className="main-view">
      <h1>MainView</h1>

      <TodoList
        tasks={tasks}
        setTasks={setTasks}
        setSelectedTask={setSelectedTask}
      />
    </div>
  );
};

export default MainView;
