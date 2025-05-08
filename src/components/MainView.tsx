import React from "react";
import TaskList from "./TaskList";
import { List, Task } from "../types";

type MainViewProps = {
  selectedList: List;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  selectedTaskId: number | undefined;
  deleteTask: (taskId: number) => void;
  toggleCompleted: (taskId: number) => void;
  setSelectedTask: React.Dispatch<React.SetStateAction<Task | undefined>>;
  handleStartNewTask: (e: React.MouseEvent<HTMLDivElement>) => void;
  selectedTaskForDebug: Task | undefined;
  setIsAddMode: React.Dispatch<React.SetStateAction<boolean>>;
  ripple: (e: React.MouseEvent<HTMLDivElement>) => void;
};

const MainView: React.FC<MainViewProps> = ({
  selectedList,
  tasks,
  setTasks,
  selectedTaskId,
  deleteTask,
  toggleCompleted,
  setSelectedTask,
  handleStartNewTask,
  selectedTaskForDebug,
  setIsAddMode,
  ripple,
}) => {
  return (
    <div className="main-view">
      <h1>{selectedList.name}</h1>

      <TaskList
        tasks={tasks}
        setTasks={setTasks}
        selectedListId={selectedList.id}
        selectedTaskId={selectedTaskId}
        deleteTask={deleteTask}
        toggleCompleted={toggleCompleted}
        setSelectedTask={setSelectedTask}
        handleStartNewTask={handleStartNewTask}
        setIsAddMode={setIsAddMode}
        ripple={ripple}
      />

      <div className="debug">
        <h2>Debug</h2>
        <p>Selected Task: {JSON.stringify(selectedTaskForDebug)}</p>
        <p>Selected List: {JSON.stringify(selectedList)}</p>
      </div>
    </div>
  );
};

export default MainView;
