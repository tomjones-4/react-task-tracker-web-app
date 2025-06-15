import React from "react";
import { Task, Subtask, Tag } from "../types";
import { FaChevronRight, FaChevronDown, FaGripVertical } from "react-icons/fa";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ExpandedSubtaskList from "./ExpandedSubtaskList";
import { AnimatePresence, motion } from "framer-motion";
import {
  TASK_VERY_HIGH_PRIORITY,
  TASK_HIGH_PRIORITY,
  TASK_MEDIUM_PRIORITY,
  TASK_LOW_PRIORITY,
  TASK_VERY_LOW_PRIORITY,
} from "../App";

const MAX_TAGS_PER_TASK_ITEM = 3;

type TaskItemProps = {
  task: Task;
  subtasks: Subtask[];
  setSubtasks: React.Dispatch<React.SetStateAction<Subtask[]>>;
  selectedTaskId: number | undefined;
  toggleCompleted: (taskId: number) => void;
  toggleSubtaskCompleted: (subtaskId: number) => void;
  setSelectedTask: React.Dispatch<React.SetStateAction<Task | undefined>>;
  tags: Tag[];
  setIsAddMode: React.Dispatch<React.SetStateAction<boolean>>;
  expandedTaskIds: Set<number>;
  toggleExpand: (taskId: number) => void;
  automaticSorting: boolean;
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
  tags,
  setIsAddMode,
  expandedTaskIds,
  toggleExpand,
  automaticSorting,
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

  const getPriorityBadge = (priority: number | null) => {
    switch (priority) {
      case TASK_VERY_HIGH_PRIORITY:
        return { label: "P1", color: "red" };
      case TASK_HIGH_PRIORITY:
        return { label: "P2", color: "orange" };
      case TASK_MEDIUM_PRIORITY:
        return { label: "P3", color: "#f5e942" }; // yellow color that's a little easier on the eyes
      case TASK_LOW_PRIORITY:
        return { label: "P4", color: "green" };
      case TASK_VERY_LOW_PRIORITY:
        return { label: "P5", color: "blue" };
      default:
        return { label: "P3", color: "#f5e942" };
    }
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div
        className={`task-item ${task.completed ? "completed" : ""} ${
          task.id == selectedTaskId ? "selected" : ""
        } 
         
        `}
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
        <span
          className="priority-badge"
          style={{
            backgroundColor: getPriorityBadge(task.priority).color,
            color: "white",
            padding: "2px 6px",
            borderRadius: "4px",
            fontSize: "0.75rem",
            fontWeight: "bold",
          }}
        >
          {getPriorityBadge(task.priority).label}
        </span>
        <span className="tags">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag.id}
              className="tag"
              style={{ backgroundColor: tag.color, fontWeight: "bold" }}
            >
              {tag.name}
            </span>
          ))}
          {/* "Overflow" tag if there are more than 3 tags on the task */}
          {tags.length > MAX_TAGS_PER_TASK_ITEM && (
            <span
              key={0}
              className="tag"
              style={{ backgroundColor: "lightskyblue", fontWeight: "bold" }}
            >
              ...
            </span>
          )}
        </span>
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

      <AnimatePresence initial={false}>
        {expandedTaskIds.has(task.id) && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              overflow: "hidden",
              paddingLeft: "0rem",
              marginTop: "0rem",
              marginBottom: "0rem",
            }}
          >
            <ExpandedSubtaskList
              subtasks={subtasks}
              setSubtasks={setSubtasks}
              selectedTaskId={selectedTaskId}
              toggleSubtaskCompleted={toggleSubtaskCompleted}
              automaticSorting={automaticSorting}
            />
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TaskItem;
