import TaskForm from "./TaskForm";
import { useState, useEffect } from "react";

const TaskView = ({
  selectedTask,
  lists,
  tags,
  deleteTask,
  addTask,
  editTask,
  isAddMode,
  addTag,
  deleteTag,
}) => {
  const [taskTitle, setTaskTitle] = useState(selectedTask.title);
  const [taskDescription, setTaskDescription] = useState(
    selectedTask.description
  );
  const [taskList, setTaskList] = useState(selectedTask.list);
  const [taskDueDate, setTaskDueDate] = useState(selectedTask.dueDate);
  const [taskTags, setTaskTags] = useState(selectedTask.tags);

  // console.log(JSON.stringify(selectedTask));
  // console.log(taskTitle);

  useEffect(() => {
    if (selectedTask) {
      setTaskTitle(selectedTask.title || "");
      setTaskDescription(selectedTask.description || "");
      setTaskList(selectedTask.list || "");
      setTaskDueDate(selectedTask.dueDate || "");
      setTaskTags(selectedTask.tags || []);
    }
  }, [selectedTask]);

  const handleAddTask = (e) => {
    const newTask = {
      id: Date.now(),
      completed: false,
      title: taskTitle,
      description: taskDescription,
      list: taskList,
      dueDate: taskDueDate,
      tags: taskTags,
    };
    addTask(newTask);
  };

  const handleEditTask = (e) => {
    const updatedTask = {
      ...selectedTask,
      title: taskTitle,
      description: taskDescription,
      list: taskList,
      dueDate: taskDueDate,
      tags: taskTags,
    };
    editTask(updatedTask);
  };

  const updateTaskList = (newListId) => {
    // TODO - need to handle "no" list case
    const newList = lists.find((list) => list.id === newListId);
    if (!newList) return; // Handle case where list is not found
    setTaskList(newList);
  };

  return (
    <div className="task-view">
      {isAddMode && <h1>Add Task</h1>}
      {!isAddMode && <h1>Edit Task</h1>}
      <TaskForm
        lists={lists}
        tags={tags}
        taskTitle={taskTitle}
        setTaskTitle={setTaskTitle}
        taskDescription={taskDescription}
        setTaskDescription={setTaskDescription}
        taskList={taskList}
        updateTaskList={updateTaskList}
        taskDueDate={taskDueDate}
        setTaskDueDate={setTaskDueDate}
        taskTags={taskTags}
        setTaskTags={setTaskTags}
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
