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
  deleteSubtask: (subtaskId: number) => void;
  toggleSubtaskCompleted: (subtaskId: number) => void;
  handleStartNewSubtask: (e: React.MouseEvent<HTMLDivElement>) => void;
  // setIsAddMode: React.Dispatch<React.SetStateAction<boolean>>;
  ripple: (e: React.MouseEvent<HTMLDivElement>) => void;
};

const SubtaskList: React.FC<SubtaskListProps> = ({
  subtasks,
  setSubtasks,
  // setSelectedSubtask,
  // selectedSubtaskId,
  selectedTaskId,
  deleteSubtask,
  toggleSubtaskCompleted,

  handleStartNewSubtask,
  // setIsAddMode,
  ripple,
}) => {
  const [subtaskTitle, setSubtaskTitle] = useState<string>("");

  // Sort subtasks: incomplete ones first, then completed ones
  const sortedSubtasks = subtasks.sort(
    (a, b) => Number(a.completed) - Number(b.completed)
  );

  console.log("subtasks", subtasks);
  console.log("sorted subtasks", sortedSubtasks);

  const handleAddSubtask = (
    e: React.MouseEvent<SVGElement> | React.KeyboardEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
    console.log("adding subtask");
    console.log(subtaskTitle);
    console.log("subtasks", subtasks);
    if (!subtaskTitle) {
      alert("Subtask title cannot be empty. TODO - use better error handling.");
      // showError("Subtask title cannot be empty.");
      return;
    }
    const newSubtask: Subtask = {
      id: Date.now(),
      completed: false,
      title: subtaskTitle,
      taskId: selectedTaskId,
    };
    console.log("newSubtask", newSubtask);
    setSubtasks([...subtasks, newSubtask]);
  };

  // useEffect(() => {

  // }, [subtasks]);

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
        handleAddSubtask={handleAddSubtask}
        subTaskTitle={subtaskTitle}
        setSubtaskTitle={setSubtaskTitle}
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
                // selectedSubtaskId={selectedSubtaskId}
                // setSelectedSubtask={setSelectedSubtask}
                toggleSubtaskCompleted={toggleSubtaskCompleted}
                // setIsAddMode={setIsAddMode}
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
