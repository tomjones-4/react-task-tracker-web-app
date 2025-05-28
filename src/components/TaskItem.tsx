import React from "react";
import { Task, Subtask } from "../types";
import { FaChevronRight, FaChevronDown, FaGripVertical } from "react-icons/fa";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ExpandedSubtaskList from "./ExpandedSubtaskList";

type TaskItemProps = {
  task: Task;
  subtasks: Subtask[];
  setSubtasks: React.Dispatch<React.SetStateAction<Subtask[]>>;
  selectedTaskId: number | undefined;
  toggleCompleted: (taskId: number) => void;
  toggleSubtaskCompleted: (subtaskId: number) => void;
  setSelectedTask: React.Dispatch<React.SetStateAction<Task | undefined>>;
  setIsAddMode: React.Dispatch<React.SetStateAction<boolean>>;
  expandedTaskIds: Set<number>;
  toggleExpand: (taskId: number) => void;
  ripple: (e: React.MouseEvent<HTMLDivElement>) => void;
};

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  subtasks,
  setSubtasks,
  selectedTaskId,
  toggleCompleted,
  toggleSubtaskCompleted,
  setSelectedTask,
  setIsAddMode,
  expandedTaskIds,
  toggleExpand,
  ripple,
}) => {
  const handleTaskClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setSelectedTask(task);
    setIsAddMode(false);
    toggleExpand(task.id);
    ripple(e);
  };

  const handleChange = () => {
    toggleCompleted(task.id);
  };

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div
        className={`task-item ${task.completed ? "completed" : ""} ${
          task.id == selectedTaskId ? "selected" : ""
        }`}
        onClick={(e) => {
          handleTaskClick(e);
        }}
      >
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleChange}
        />
        <p>{task.title}</p>
        {/* <button onClick={() => deleteTask(task.id)}>X</button> */}
        <span {...listeners} className="drag-handle">
          <FaGripVertical onClick={(e) => e.stopPropagation()} />
        </span>
        {expandedTaskIds.has(task.id) ? (
          <FaChevronDown className="expand-task-icon" />
        ) : (
          <FaChevronRight className="expand-task-icon" />
        )}
        <span className="ripple" />
      </div>
      {expandedTaskIds.has(task.id) && (
        <ExpandedSubtaskList
          subtasks={subtasks}
          setSubtasks={setSubtasks}
          selectedTaskId={selectedTaskId}
          toggleSubtaskCompleted={toggleSubtaskCompleted}
        />
      )}
    </div>
  );
};

export default TaskItem;
