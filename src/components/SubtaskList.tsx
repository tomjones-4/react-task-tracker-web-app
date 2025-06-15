import React, { useState, useRef, useEffect } from "react";
import SubtaskItem from "./SubtaskItem";
import AddSubtaskItem from "./AddSubtaskItem";
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

type SubtaskListProps = {
  subtasks: Subtask[];
  setSubtasks: React.Dispatch<React.SetStateAction<Subtask[]>>;
  selectedTaskId: number;
  addSubtask: (newSubtask: Subtask) => void;
  toggleSubtaskCompleted: (subtaskId: number) => void;
  editSubtask: (editedSubtask: Subtask) => void;
  deleteSubtask: (subtaskId: number) => void;
  showError: (message: string) => void;
  setError: React.Dispatch<React.SetStateAction<string>>;
  automaticSorting: boolean;
};

const SubtaskList: React.FC<SubtaskListProps> = ({
  subtasks,
  setSubtasks,
  selectedTaskId,
  addSubtask,
  toggleSubtaskCompleted,
  editSubtask,
  deleteSubtask,
  showError,
  setError,
  automaticSorting,
}) => {
  // Sort subtasks: incomplete ones first, then completed ones
  const sortedSubtasks = automaticSorting
    ? subtasks.sort((a, b) => Number(a.completed) - Number(b.completed))
    : subtasks;

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
      return [...otherSubtasks, ...reorderedSubtasks]; // otherSubtasks is very important - without it, subtasks array would be set to just the subtasks that match selectedTaskId
    });
  };

  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedTaskId !== -1) {
      setSubtasks((prev) => prev.filter((subtask) => subtask.taskId !== -1));
    }
  }, [selectedTaskId]);

  return (
    <div className="subtask-list-container">
      <AddSubtaskItem
        addSubtask={addSubtask}
        selectedTaskId={selectedTaskId}
        showError={showError}
        setError={setError}
      />
      <div className="subtask-list" ref={listRef}>
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
              <SubtaskItem
                key={subtask.id}
                subtask={subtask}
                toggleSubtaskCompleted={toggleSubtaskCompleted}
                editSubtask={editSubtask}
                deleteSubtask={deleteSubtask}
                showError={showError}
                setError={setError}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default SubtaskList;
