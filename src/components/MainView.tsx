import React from "react";
import TaskList from "./TaskList";
import { List, Task } from "../types";
import CalendarView from "./CalendarView";
import AddTaskItem from "./AddTaskItem";

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
  listSelectedTasksIds: number[];
  setListSelectedTaskIds: React.Dispatch<React.SetStateAction<number[]>>;
  listScrollPositions: number[];
  setListScrollPositions: React.Dispatch<React.SetStateAction<number[]>>;
  showCalendarView: boolean;
  onCalendarCreateTask: (startDate: Date) => void;
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
  listSelectedTasksIds,
  setListSelectedTaskIds,
  listScrollPositions,
  setListScrollPositions,
  showCalendarView,
  onCalendarCreateTask,
}) => {
  return (
    <div className="main-view">
      <h1>{selectedList.name}</h1>

      {!showCalendarView && (
        <>
          <AddTaskItem handleStartNewTask={handleStartNewTask} />
          <TaskList
            tasks={tasks}
            setTasks={setTasks}
            selectedListId={selectedList.id}
            selectedTaskId={selectedTaskId}
            deleteTask={deleteTask}
            toggleCompleted={toggleCompleted}
            setSelectedTask={setSelectedTask}
            setIsAddMode={setIsAddMode}
            ripple={ripple}
            listSelectedTasksIds={listSelectedTasksIds}
            setListSelectedTaskIds={setListSelectedTaskIds}
            listScrollPositions={listScrollPositions}
            setListScrollPositions={setListScrollPositions}
          />
        </>
      )}

      {showCalendarView && (
        <CalendarView
          tasks={tasks}
          onCalendarTaskClick={setSelectedTask}
          onCalendarCreateTask={onCalendarCreateTask}
        />
      )}

      {/* <div className="debug">
        <h2>Debug</h2>
        <p>Selected Task: {JSON.stringify(selectedTaskForDebug)}</p>
        <p>Selected List: {JSON.stringify(selectedList.name)}</p>
        <p>
          Selected Task:{" "}
          {selectedTaskForDebug
            ? `"${selectedTaskForDebug.title}" (ID: ${selectedTaskForDebug.id}, List ID: ${selectedTaskForDebug.listId})`
            : "No task selected"}
        </p>
        <p>
          Selected List: "{selectedList.name}" (ID: {selectedList.id})
        </p>
      </div> */}
    </div>
  );
};

export default MainView;
