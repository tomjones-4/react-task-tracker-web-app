import TaskForm from "./TaskForm";
import { useState, useEffect, forwardRef } from "react";
import { List, Task, Subtask, Tag } from "../types";

type TaskViewProps = {
  selectedListId: number;
  selectedTask: Task;
  lists: List[];
  tags: Tag[];
  deleteTask: (taskId: number) => void;
  addTask: (newTask: Task) => void;
  editTask: (editedTask: Task) => void;
  isAddMode: boolean;
  addTag: (newTag: Tag) => void;
  deleteTag: (tagId: number) => void;
  subtasks: Subtask[];
  setSubtasks: React.Dispatch<React.SetStateAction<Subtask[]>>;
  // setSelectedSubtask: React.Dispatch<React.SetStateAction<Subtask | undefined>>;
  // selectedSubtaskId: number | undefined;
  deleteSubtask: (subtaskId: number) => void;
  toggleSubtaskCompleted: (subtaskId: number) => void;
  handleStartNewSubtask: (e: React.MouseEvent<HTMLDivElement>) => void;
  ripple: (e: React.MouseEvent<HTMLDivElement>) => void;
  // addSubtask: (newSubtask: Subtask) => void;
};

export type TaskFormRef = {
  focusTitleInput: () => void;
};

const TaskView = forwardRef<TaskFormRef, TaskViewProps>(
  (
    {
      selectedListId,
      selectedTask,
      lists,
      tags,
      deleteTask,
      addTask,
      editTask,
      isAddMode,
      addTag,
      deleteTag,
      subtasks,
      setSubtasks,
      // setSelectedSubtask,
      // selectedSubtaskId,
      deleteSubtask,
      toggleSubtaskCompleted,
      handleStartNewSubtask,
      ripple,
      // addSubtask,
    },
    ref
  ) => {
    return (
      <div className="task-view">
        {isAddMode && <h1>Add Task</h1>}
        {!isAddMode && <h1>Edit Task</h1>}
        <TaskForm
          lists={lists}
          tags={tags}
          selectedListId={selectedListId}
          selectedTask={selectedTask}
          deleteTask={deleteTask}
          isAddMode={isAddMode}
          addTask={addTask}
          editTask={editTask}
          addTag={addTag}
          deleteTag={deleteTag}
          subtasks={subtasks}
          setSubtasks={setSubtasks}
          // setSelectedSubtask={setSelectedSubtask}
          // selectedSubtaskId={selectedSubtaskId}
          deleteSubtask={deleteSubtask}
          toggleSubtaskCompleted={toggleSubtaskCompleted}
          handleStartNewSubtask={handleStartNewSubtask}
          ripple={ripple}
          // addSubtask={addSubtask}
          ref={ref}
        />
      </div>
    );
  }
);

export default TaskView;
