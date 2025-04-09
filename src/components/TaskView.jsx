import TaskForm from "./TaskForm";
import { useState, useEffect } from "react";

const TaskView = ({
  selectedTask,
  lists,
  deleteTask,
  addTask,
  editTask,
  isAddMode,
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
      setTaskTags(selectedTask.tags || "");
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

  return (
    <div>
      {isAddMode && <h1>Add Task</h1>}
      {!isAddMode && <h1>Edit Task</h1>}
      <TaskForm
        lists={lists}
        taskTitle={taskTitle}
        setTaskTitle={setTaskTitle}
        taskDescription={taskDescription}
        setTaskDescription={setTaskDescription}
        taskList={taskList}
        setTaskList={setTaskList}
        taskDueDate={taskDueDate}
        setTaskDueDate={setTaskDueDate}
        taskTags={taskTags}
        setTaskTags={setTaskTags}
      />
      <div className="task-buttons">
        <h3>Task Details</h3>
        <p>{selectedTask.completed ? "Completed" : "Not Completed"}</p>
        <button onClick={(e) => deleteTask(selectedTask.id)}>
          Delete task
        </button>
        {!isAddMode && <button onClick={handleEditTask}>Save changes</button>}
        {isAddMode && <button onClick={handleAddTask}>Add new task</button>}
      </div>
    </div>
  );
};

export default TaskView;
