import React, { useState, useEffect, useRef } from "react";
import TaskItem from "./TaskItem";
import { Task, Subtask, Tag, Time } from "../types";
import { SPECIAL_LIST_ID_ALL_TASKS, TASK_MEDIUM_PRIORITY } from "../App";
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
  subtasks: Subtask[];
  setSubtasks: React.Dispatch<React.SetStateAction<Subtask[]>>;
  selectedListId: number;
  selectedTaskId: number | undefined;
  deleteTask: (taskId: number) => void;
  toggleCompleted: (taskId: number) => void;
  toggleSubtaskCompleted: (subtaskId: number) => void;
  setSelectedTask: React.Dispatch<React.SetStateAction<Task | undefined>>;
  tags: Tag[];
  setIsAddMode: React.Dispatch<React.SetStateAction<boolean>>;
  ripple: (e: React.MouseEvent<HTMLDivElement>) => void;
  listScrollPositions: number[];
  setListScrollPositions: React.Dispatch<React.SetStateAction<number[]>>;
  automaticSorting: boolean;
  selectedTagIds: number[];
};

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  setTasks,
  subtasks,
  setSubtasks,
  selectedListId,
  selectedTaskId,
  toggleCompleted,
  toggleSubtaskCompleted,
  setSelectedTask,
  tags,
  setIsAddMode,
  ripple,
  listScrollPositions,
  setListScrollPositions,
  automaticSorting,
  selectedTagIds,
}) => {
  const compareTasks = (a: Task, b: Task): number => {
    // 1. Sort by completed
    if (a.completed !== b.completed) {
      return Number(a.completed) - Number(b.completed);
    }

    // 2. Sort by priority (lower number = higher priority)
    if (a.priority !== b.priority) {
      return (
        (a.priority ?? TASK_MEDIUM_PRIORITY) -
        (b.priority ?? TASK_MEDIUM_PRIORITY)
      );
    }

    // 3. Sort by dueDate + startTime
    const aHasDueDate = a.dueDate !== null;
    const bHasDueDate = b.dueDate !== null;

    if (aHasDueDate && !bHasDueDate) return -1;
    if (!aHasDueDate && bHasDueDate) return 1;
    if (!aHasDueDate && !bHasDueDate) return 0;

    // At this point both have dueDate
    const dateDiff =
      new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime();
    if (dateDiff !== 0) return dateDiff;

    // Tie on dueDate: handle startTime
    const aHasStartTime = a.startTime !== null;
    const bHasStartTime = b.startTime !== null;

    if (aHasStartTime && !bHasStartTime) return -1;
    if (!aHasStartTime && bHasStartTime) return 1;
    if (!aHasStartTime && !bHasStartTime) return 0;

    // Both have startTime — compare hour, minute, and am/pm
    const aTime = to24HourTime(a.startTime!);
    const bTime = to24HourTime(b.startTime!);

    return aTime.totalMinutes - bTime.totalMinutes;
  };

  // Helper to convert AM/PM time to total minutes
  const to24HourTime = (time: Time): { totalMinutes: number } => {
    let { hour, minute, ampm } = time;
    if (hour === 12) hour = 0;
    const hour24 = ampm === "pm" ? hour + 12 : hour;
    return { totalMinutes: hour24 * 60 + minute };
  };

  const sortedTasks = automaticSorting ? tasks.sort(compareTasks) : tasks;

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;

    const oldIndex = tasks.findIndex((t) => t.id === active.id);
    const newIndex = tasks.findIndex((t) => t.id === over.id);
    const reorderedTasks = arrayMove(tasks, oldIndex, newIndex); // tasks is the subset that matches current list + tags only

    const reorderedTaskIds = new Set(reorderedTasks.map((t) => t.id));
    setTasks((prev) => [
      ...prev.filter((task) => !reorderedTaskIds.has(task.id)), // this line is very important - without it, tasks array would be set to just the tasks that match current filters with list and tags
      ...reorderedTasks,
    ]);
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

  const [expandedTaskIds, setExpandedTaskIds] = useState<Set<number>>(
    new Set()
  );

  const toggleExpand = (taskId: number) => {
    setExpandedTaskIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  return (
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
              subtasks={subtasks.filter(
                (subtask) => subtask.taskId === task.id
              )}
              setSubtasks={setSubtasks}
              selectedTaskId={selectedTaskId}
              toggleCompleted={toggleCompleted}
              toggleSubtaskCompleted={toggleSubtaskCompleted}
              setSelectedTask={setSelectedTask}
              tags={tags.filter((tag) => task.tagIds.includes(tag.id))} // filter tags to only those that are in the task's tagIds
              setIsAddMode={setIsAddMode}
              expandedTaskIds={expandedTaskIds}
              toggleExpand={toggleExpand}
              automaticSorting={automaticSorting}
              ripple={ripple}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default TaskList;
