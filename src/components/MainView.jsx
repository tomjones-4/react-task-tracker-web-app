import TaskList from "./TaskList";

const MainView = ({
  selectedList,
  tasks,
  selectedTaskId,
  deleteTask,
  toggleCompleted,
  setSelectedTask,
  handleStartNewTask,
  selectedTaskForDebug,
  setIsAddMode,
}) => {
  return (
    <div className="main-view">
      <h1>{selectedList.name}</h1>

      <TaskList
        tasks={tasks}
        selectedTaskId={selectedTaskId}
        deleteTask={deleteTask}
        toggleCompleted={toggleCompleted}
        setSelectedTask={setSelectedTask}
        handleStartNewTask={handleStartNewTask}
        setIsAddMode={setIsAddMode}
      />

      <div>
        <h2>Debug</h2>
        <p>Selected Task: {JSON.stringify(selectedTaskForDebug)}</p>
        <p>Selected List: {JSON.stringify(selectedList)}</p>
      </div>
    </div>
  );
};

export default MainView;
