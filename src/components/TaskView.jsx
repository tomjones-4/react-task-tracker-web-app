import TodoForm from "./TodoForm";
import { useState, useEffect } from "react";

const TaskView = ({ selectedTask, lists, deleteTask, addTask, editTask }) => {
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

  return (
    <div>
      <h1>Task</h1>
      <TodoForm
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
        <button onClick={handleAddTask}>Save changes</button>
      </div>
    </div>
  );
};

export default TaskView;
