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
  // setSelectedSubtask: React.Dispatch<React.SetStateAction<Subtask | undefined>>;
  // selectedSubtaskId: number | undefined;
  selectedTaskId: number;
  addSubtask: (newSubtask: Subtask) => void;
  toggleSubtaskCompleted: (subtaskId: number) => void;
  editSubtask: (editedSubtask: Subtask) => void;
  deleteSubtask: (subtaskId: number) => void;

  // handleStartNewSubtask: (e: React.MouseEvent<HTMLDivElement>) => void;
  ripple: (e: React.MouseEvent<HTMLDivElement>) => void;
};

const SubtaskList: React.FC<SubtaskListProps> = ({
  subtasks,
  setSubtasks,
  // setSelectedSubtask,
  // selectedSubtaskId,
  selectedTaskId,
  addSubtask,
  toggleSubtaskCompleted,
  editSubtask,
  deleteSubtask,

  // handleStartNewSubtask,
  ripple,
}) => {
  // Sort subtasks: incomplete ones first, then completed ones
  const sortedSubtasks = subtasks.sort(
    (a, b) => Number(a.completed) - Number(b.completed)
  );

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over) return; //safeguard against null
    if (active.id !== over.id) {
      const oldIndex = subtasks.findIndex((s) => s.id === active.id);
      const newIndex = subtasks.findIndex((s) => s.id === over.id);
      setSubtasks((subtasks) => arrayMove(subtasks, oldIndex, newIndex));
    }
  };

  const listRef = useRef<HTMLDivElement>(null);

  return (
    <div className="task-list-container">
      <AddSubtaskItem
        addSubtask={addSubtask}
        selectedTaskId={selectedTaskId}
        ripple={ripple}
      />
      <div className="task-list" ref={listRef}>
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
                // selectedSubtaskId={selectedSubtaskId}
                // setSelectedSubtask={setSelectedSubtask}
                // ripple={ripple}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default SubtaskList;
