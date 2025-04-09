import TaskList from "./TaskList";

const MainView = ({
  tasks,
  deleteTask,
  toggleCompleted,
  setSelectedTask,
  resetTask,
  selectedTaskForDebug,
}) => {
  return (
    <div className="main-view">
      <h1>MainView</h1>

      <TaskList
        tasks={tasks}
        deleteTask={deleteTask}
        toggleCompleted={toggleCompleted}
        setSelectedTask={setSelectedTask}
        resetTask={resetTask}
      />

      <div
        className="debug"
        onClick={() =>
          console.log("selectedTaskForDebug = ", selectedTaskForDebug)
        }
      >
        <h2>Debug</h2>
        <p>Selected Task: {JSON.stringify(selectedTaskForDebug)}</p>
      </div>
    </div>
  );
};

export default MainView;
