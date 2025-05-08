import React, { useState, useEffect, useRef } from "react";
import TaskItem from "./TaskItem.jsx";
import AddTaskItem from "./AddTaskItem.jsx";
import { Task } from "../types";
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
  handleStartNewTask: (e: React.MouseEvent<HTMLDivElement>) => void;
  setIsAddMode: React.Dispatch<React.SetStateAction<boolean>>;
  ripple: (e: React.MouseEvent<HTMLDivElement>) => void;
};

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  setTasks,
  selectedListId,
  selectedTaskId,
  deleteTask,
  toggleCompleted,
  setSelectedTask,
  handleStartNewTask,
  setIsAddMode,
  ripple,
}) => {
  // Sort tasks: incomplete ones first, then completed ones
  const sortedTasks = tasks.sort(
    (a, b) => Number(a.completed) - Number(b.completed)
  );

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over) return; //safeguard against null
    if (active.id !== over.id) {
      const oldIndex = tasks.findIndex((t) => t.id === active.id);
      const newIndex = tasks.findIndex((t) => t.id === over.id);
      setTasks((tasks) => arrayMove(tasks, oldIndex, newIndex));
    }
  };

  const listRef = useRef<HTMLDivElement>(null);
  const [listSelectedTasksIds, setListSelectedTaskIds] = useState<number[]>([]);
  const [scrollPositions, setScrollPositions] = useState<number[]>([]);

  useEffect(() => {
    if (selectedTaskId) {
      setListSelectedTaskIds((prevIds) => ({
        ...prevIds,
        [selectedListId]: selectedTaskId,
      }));
    }
  }, [selectedTaskId]);

  useEffect(() => {
    const handleScroll = () => {
      if (listRef.current) {
        const currentList = listRef.current;
        setScrollPositions((prevScrollPositions) => ({
          ...prevScrollPositions,
          [selectedListId]: currentList.scrollTop,
        }));
      }
    };

    const el = listRef.current;
    el?.addEventListener("scroll", handleScroll);
    return () => el?.removeEventListener("scroll", handleScroll);
  }, [selectedListId]);

  useEffect(() => {
    if (listRef.current && scrollPositions[selectedListId] !== undefined) {
      listRef.current.scrollTop = scrollPositions[selectedListId];
    }
    if (listSelectedTasksIds[selectedListId]) {
      console.log("setting task");
      const id = listSelectedTasksIds[selectedListId];
      setSelectedTask(tasks.find((task: Task) => task.id === id));
    }
  }, [selectedListId]);

  return (
    <div className="task-list-container">
      <AddTaskItem handleStartNewTask={handleStartNewTask} />
      <div className="task-list" ref={listRef}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sortedTasks.map((task) => task.id)}
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
    </div>
  );
};

export default TaskList;
