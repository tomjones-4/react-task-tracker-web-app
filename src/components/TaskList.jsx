import React, { useState, useEffect } from "react";
import TaskItem from "./TaskItem.jsx";
import AddTaskItem from "./AddTaskItem.jsx";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  verticalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";

const TaskList = ({
  tasks,
  setTasks,
  selectedTaskId,
  deleteTask,
  toggleCompleted,
  setSelectedTask,
  handleStartNewTask,
  setIsAddMode,
  ripple,
}) => {
  // Sort tasks: incomplete ones first, then completed ones
  const sortedTasks = tasks.sort((a, b) => a.completed - b.completed);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = tasks.findIndex((t) => t.id === active.id);
      const newIndex = tasks.findIndex((t) => t.id === over.id);
      setTasks((tasks) => arrayMove(tasks, oldIndex, newIndex));
    }
  };

  return (
    <div className="task-list-container">
      <div className="task-list">
        <AddTaskItem
          handleStartNewTask={handleStartNewTask}
          className="add-task"
        />
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
                deleteTask={deleteTask}
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
