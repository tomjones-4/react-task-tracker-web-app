import TaskForm from "./TaskForm";
import SubtaskList from "./SubtaskList";
import { useState, useEffect, forwardRef } from "react";
import { List, Task, Tag } from "../types";

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
          ref={ref}
        />
        <SubtaskList />
      </div>
    );
  }
);

export default TaskView;
