import TaskList from "./TaskList";

const MainView = ({
  tasks,
  deleteTask,
  toggleCompleted,
  setSelectedTask,
  resetTask,
  selectedTaskForDebug,
  setIsAddMode,
}) => {
  return (
    <div className="main-view">
      <h1>Task List</h1>

      <TaskList
        tasks={tasks}
        deleteTask={deleteTask}
        toggleCompleted={toggleCompleted}
        setSelectedTask={setSelectedTask}
        resetTask={resetTask}
        setIsAddMode={setIsAddMode}
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
