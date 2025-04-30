import TaskForm from "./TaskForm";
import { useState, useEffect } from "react";

const TaskView = ({
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
  taskFormRef,
}) => {
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
        //selectedListId={selectedListId}
        titleRef={taskFormRef}
        handleAddTask={handleAddTask}
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
      />
      <div>
        <button
          className="task-button delete-task-button"
          onClick={(e) => deleteTask(selectedTask.id)}
        >
          Delete task
        </button>
        {!isAddMode && (
          <button
            className="task-button save-task-button"
            onClick={handleEditTask}
          >
            Save changes
          </button>
        )}
        {isAddMode && (
          <button
            className="task-button save-task-button"
            onClick={handleAddTask}
          >
            Add new task
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskView;
