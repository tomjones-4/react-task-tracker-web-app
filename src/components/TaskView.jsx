import TaskForm from "./TaskForm";
import { useState, useEffect, forwardRef } from "react";

const TaskView = forwardRef(
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
    const [taskTitle, setTaskTitle] = useState(selectedTask.title);
    const [taskDescription, setTaskDescription] = useState(
      selectedTask.description
    );
    const [taskListId, setTaskListId] = useState(selectedListId);
    const [taskDueDate, setTaskDueDate] = useState(selectedTask.dueDate);
    const [taskTagIds, setTaskTagIds] = useState(selectedTask.tagIds);

    useEffect(() => {
      if (selectedTask) {
        setTaskTitle(selectedTask.title || "");
        setTaskDescription(selectedTask.description || "");
        setTaskListId(selectedListId || 0);
        setTaskDueDate(selectedTask.dueDate || "");
        setTaskTagIds(selectedTask.tagIds || []);
      }
    }, [selectedTask]);

    const handleAddTask = (e) => {
      // TODO - consider making this cleaner than an alert
      if (!taskTitle) {
        alert("Please enter a title for the task.");
        return;
      }
      const newTask = {
        id: Date.now(),
        completed: false,
        title: taskTitle,
        description: taskDescription,
        listId: taskListId,
        dueDate: taskDueDate,
        tagIds: taskTagIds,
      };
      addTask(newTask);
    };

    const handleEditTask = (e) => {
      const updatedTask = {
        ...selectedTask,
        title: taskTitle,
        description: taskDescription,
        listId: taskListId,
        dueDate: taskDueDate,
        tagIds: taskTagIds,
      };
      editTask(updatedTask);
    };

    return (
      <div className="task-view">
        {isAddMode && <h1>Add Task</h1>}
        {!isAddMode && <h1>Edit Task</h1>}
        <TaskForm
          lists={lists}
          tags={tags}
          selectedTaskId={selectedTask.id}
          deleteTask={deleteTask}
          isAddMode={isAddMode}
          handleAddTask={handleAddTask}
          handleEditTask={handleEditTask}
          taskTitle={taskTitle}
          setTaskTitle={setTaskTitle}
          taskDescription={taskDescription}
          setTaskDescription={setTaskDescription}
          taskListId={taskListId}
          setTaskListId={setTaskListId}
          taskDueDate={taskDueDate}
          setTaskDueDate={setTaskDueDate}
          taskTagIds={taskTagIds}
          setTaskTagIds={setTaskTagIds}
          addTag={addTag}
          deleteTag={deleteTag}
          ref={ref}
        />
      </div>
    );
  }
);

export default TaskView;
