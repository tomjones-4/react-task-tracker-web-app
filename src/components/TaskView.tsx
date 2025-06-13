import TaskForm from "./TaskForm";
import { forwardRef } from "react";
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
  addSubtask: (newSubtask: Subtask) => void;
  editSubtask: (editedSubtask: Subtask) => void;
  deleteSubtask: (subtaskId: number) => void;
  toggleSubtaskCompleted: (subtaskId: number) => void;
  linkNewSubtasksToTask: (taskId: number) => void;
  automaticSorting: boolean;
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
      addSubtask,
      editSubtask,
      deleteSubtask,
      toggleSubtaskCompleted,
      linkNewSubtasksToTask,
      automaticSorting,
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
          addSubtask={addSubtask}
          editSubtask={editSubtask}
          deleteSubtask={deleteSubtask}
          toggleSubtaskCompleted={toggleSubtaskCompleted}
          linkNewSubtasksToTask={linkNewSubtasksToTask}
          automaticSorting={automaticSorting}
          ref={ref}
        />
      </div>
    );
  }
);

export default TaskView;
