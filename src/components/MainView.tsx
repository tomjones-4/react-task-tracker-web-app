import React from "react";
import TaskList from "./TaskList";
import { List, Task, Subtask, Tag } from "../types";
import CalendarView from "./CalendarView";
import AddTaskItem from "./AddTaskItem";

type MainViewProps = {
  selectedList: List;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  subtasks: Subtask[];
  setSubtasks: React.Dispatch<React.SetStateAction<Subtask[]>>;
  selectedTaskId: number | undefined;
  deleteTask: (taskId: number) => void;
  toggleCompleted: (taskId: number) => void;
  toggleSubtaskCompleted: (subtaskId: number) => void;
  setSelectedTask: React.Dispatch<React.SetStateAction<Task | undefined>>;
  handleStartNewTask: (e: React.MouseEvent<HTMLDivElement>) => void;
  tags: Tag[];
  selectedTaskForDebug: Task | undefined;
  setIsAddMode: React.Dispatch<React.SetStateAction<boolean>>;
  ripple: (e: React.MouseEvent<HTMLDivElement>) => void;
  listScrollPositions: number[];
  setListScrollPositions: React.Dispatch<React.SetStateAction<number[]>>;
  showCalendarView: boolean;
  onCalendarCreateTask: (startDate: Date) => void;
  automaticSorting: boolean;
  selectedTagIds: number[];
};

const MainView: React.FC<MainViewProps> = ({
  selectedList,
  tasks,
  setTasks,
  subtasks,
  setSubtasks,
  selectedTaskId,
  deleteTask,
  toggleCompleted,
  toggleSubtaskCompleted,
  setSelectedTask,
  handleStartNewTask,
  tags,
  selectedTaskForDebug,
  setIsAddMode,
  ripple,
  listScrollPositions,
  setListScrollPositions,
  showCalendarView,
  onCalendarCreateTask,
  automaticSorting,
  selectedTagIds,
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
            subtasks={subtasks}
            setSubtasks={setSubtasks}
            selectedListId={selectedList.id}
            selectedTaskId={selectedTaskId}
            deleteTask={deleteTask}
            toggleCompleted={toggleCompleted}
            toggleSubtaskCompleted={toggleSubtaskCompleted}
            setSelectedTask={setSelectedTask}
            tags={tags}
            setIsAddMode={setIsAddMode}
            ripple={ripple}
            listScrollPositions={listScrollPositions}
            setListScrollPositions={setListScrollPositions}
            automaticSorting={automaticSorting}
            selectedTagIds={selectedTagIds}
          />
        </>
      )}

      {showCalendarView && (
        <CalendarView
          tasks={tasks}
          onCalendarTaskClick={(task: Task) => {
            setSelectedTask(task);
            setIsAddMode(false);
          }}
          onCalendarCreateTask={onCalendarCreateTask}
        />
      )}
      {/* 
      <div className="debug">
        <h2>Debug</h2>
        <p>Selected Task: {JSON.stringify(selectedTaskForDebug)}</p>
        <p>
          Selected List: "{selectedList.name}" (ID: {selectedList.id})
        </p>
        <p>
          Expanded Task:{" "}
          {selectedTaskForDebug
            ? `"${selectedTaskForDebug.title}" (ID: ${selectedTaskForDebug.id}, List ID: ${selectedTaskForDebug.listId})`
            : "No task selected"}
        </p>
        <p>
          # of tasks with priority set but not to default value:{" "}
          {JSON.stringify(
            tasks.filter(
              (t) =>
                t.priority !== 3 &&
                t.priority !== null &&
                t.priority !== undefined
            ).length
          )}
        </p>
        <p>
          # of tasks with priority set to default value:{" "}
          {JSON.stringify(
            tasks.filter(
              (t) =>
                t.priority === 3 &&
                t.priority !== null &&
                t.priority !== undefined
            ).length
          )}
        </p>
        <p>
          # of tasks with priority set to null :{" "}
          {JSON.stringify(tasks.filter((t) => t.priority === null).length)}
        </p>
        <p>
          # of tasks with priority set to undefined :{" "}
          {JSON.stringify(tasks.filter((t) => t.priority === undefined).length)}
        </p>
      </div> */}
    </div>
  );
};

export default MainView;
