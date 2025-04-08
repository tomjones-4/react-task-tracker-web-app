import TodoList from "./TodoList";

const MainView = ({
  tasks,
  deleteTask,
  toggleCompleted,
  changeSelectedTask,
  resetTask,
}) => {
  return (
    <div className="main-view">
      <h1>MainView</h1>

      <TodoList
        tasks={tasks}
        deleteTask={deleteTask}
        toggleCompleted={toggleCompleted}
        changeSelectedTask={changeSelectedTask}
        resetTask={resetTask}
      />
    </div>
  );
};

export default MainView;
