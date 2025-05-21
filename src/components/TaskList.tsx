import React, { useState, useEffect, useRef } from "react";
import TaskItem from "./TaskItem.jsx";
import { Task } from "../types";
import { SPECIAL_LIST_ID_ALL_TASKS } from "../App";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  verticalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";

type TaskListProps = {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  selectedListId: number;
  selectedTaskId: number | undefined;
  deleteTask: (taskId: number) => void;
  toggleCompleted: (taskId: number) => void;
  setSelectedTask: React.Dispatch<React.SetStateAction<Task | undefined>>;
  //handleStartNewTask: (e: React.MouseEvent<HTMLDivElement>) => void;
  setIsAddMode: React.Dispatch<React.SetStateAction<boolean>>;
  ripple: (e: React.MouseEvent<HTMLDivElement>) => void;
  listSelectedTasksIds: number[];
  setListSelectedTaskIds: React.Dispatch<React.SetStateAction<number[]>>;
  listScrollPositions: number[];
  setListScrollPositions: React.Dispatch<React.SetStateAction<number[]>>;
};

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  setTasks,
  selectedListId,
  selectedTaskId,
  deleteTask,
  toggleCompleted,
  setSelectedTask,
  //handleStartNewTask,
  setIsAddMode,
  ripple,
  listSelectedTasksIds,
  setListSelectedTaskIds,
  listScrollPositions,
  setListScrollPositions,
}) => {
  // useEffect(() => {
  //   console.log("TaskList mounted");
  //   return () => {
  //     console.log("TaskList unmounted");
  //   };
  // }, []);

  // Sort tasks: incomplete ones first, then completed ones
  const sortedTasks = tasks.sort(
    (a, b) => Number(a.completed) - Number(b.completed)
  );
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;

    const oldIndex = tasks.findIndex((t) => t.id === active.id);
    const newIndex = tasks.findIndex((t) => t.id === over.id);
    const reorderedTasks = arrayMove(tasks, oldIndex, newIndex); // `tasks` is the subset (current list only)

    setTasks((prev) => {
      // Filter out tasks that belong to the current list
      const otherTasks = prev.filter(
        (t: Task) =>
          t.listId !== selectedListId &&
          selectedListId !== SPECIAL_LIST_ID_ALL_TASKS
      );

      // Combine reordered list-tasks with all other tasks
      return [...otherTasks, ...reorderedTasks];
    });
  };

  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // set list's scroll position to what's been saved
    if (listRef.current && listScrollPositions[selectedListId] !== undefined) {
      listRef.current.scrollTop = listScrollPositions[selectedListId];
    }

    // create handleScroll method that tracks list scroll position and stores in state variable listScrollPositions
    const handleScroll = () => {
      if (listRef.current) {
        const currentList = listRef.current;
        setListScrollPositions((prevScrollPositions) => ({
          ...prevScrollPositions,
          [selectedListId]: currentList.scrollTop,
        }));
      }
    };

    const el = listRef.current;
    el?.addEventListener("scroll", handleScroll);
    return () => el?.removeEventListener("scroll", handleScroll);
  }, [selectedListId]);

  return (
    <div className="task-list" ref={listRef}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sortedTasks.map((task) => task.id)}
          // items={sortedTasks.map((task) => task.id.toString())}
          strategy={verticalListSortingStrategy}
        >
          {sortedTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              selectedTaskId={selectedTaskId}
              toggleCompleted={toggleCompleted}
              setSelectedTask={setSelectedTask}
              setIsAddMode={setIsAddMode}
              ripple={ripple}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default TaskList;
