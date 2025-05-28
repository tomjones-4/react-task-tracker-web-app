import React, { useState, useRef, useEffect } from "react";
import ExpandedSubtaskItem from "./ExpandedSubtaskItem";
import { Subtask } from "../types";
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

type ExpandedSubtaskListProps = {
  subtasks: Subtask[];
  setSubtasks: React.Dispatch<React.SetStateAction<Subtask[]>>;
  selectedTaskId: number | undefined;
  toggleSubtaskCompleted: (subtaskId: number) => void;
};

const ExpandedSubtaskList: React.FC<ExpandedSubtaskListProps> = ({
  subtasks,
  setSubtasks,
  selectedTaskId,
  toggleSubtaskCompleted,
}) => {
  // Sort subtasks: incomplete ones first, then completed ones
  const sortedSubtasks = subtasks.sort(
    (a, b) => Number(a.completed) - Number(b.completed)
  );

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;

    if (!over || active.id === over.id) return;

    const oldIndex = subtasks.findIndex((s: Subtask) => s.id === active.id);
    const newIndex = subtasks.findIndex((s: Subtask) => s.id === over.id);
    const reorderedSubtasks = arrayMove(subtasks, oldIndex, newIndex); // 'subtasks' is the subset (current task only)

    setSubtasks((prev) => {
      // Filter out subtasks that belong to the current task
      const otherSubtasks = prev.filter(
        (s: Subtask) => s.taskId !== selectedTaskId
      );

      // Combine reordered subtasks for selected task with all other subtasks
      return [...otherSubtasks, ...reorderedSubtasks];
    });
  };

  const listRef = useRef<HTMLDivElement>(null);
  return (
    // <div className="subtask-list-container">
    <div className="subtask-list expanded-subtask-list" ref={listRef}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sortedSubtasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {sortedSubtasks.map((subtask: Subtask) => (
            <ExpandedSubtaskItem
              key={subtask.id}
              subtask={subtask}
              toggleSubtaskCompleted={toggleSubtaskCompleted}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
    // </div>
  );
};

export default ExpandedSubtaskList;
