import "./App.css";
import Menu from "./components/Menu.jsx";
import MainView from "./components/MainView.jsx";
import TaskView from "./components/TaskView.jsx";
import { useState, useEffect } from "react";

// TODO
// Text should be reset and managed when clicking on the "Add New Task" button
// Tasks should be added from the right side task view

const App = () => {
  const LOCAL_STORAGE_KEY = "todoApp.tasks";

  const fakeLists = [
    { id: 1, name: "List 1", color: "blue", length: 3 },
    { id: 2, name: "List 2", color: "red", length: 6 },
  ];

  const [tasks, setTasks] = useState(() => {
    const storedTasks = localStorage.getItem(LOCAL_STORAGE_KEY);
    return storedTasks ? JSON.parse(storedTasks) : []; // Load from localStorage or default to []
  });

  const [selectedTask, setSelectedTask] = useState(
    tasks.length > 0 ? tasks[0] : null
  );

  const [taskTitle, setTaskTitle] = useState(selectedTask.text);
  const [taskDescription, setTaskDescription] = useState(
    selectedTask.description
  );
  const [taskList, setTaskList] = useState(selectedTask.list);
  const [taskDueDate, setTaskDueDate] = useState(selectedTask.dueDate);
  const [taskTags, setTaskTags] = useState(selectedTask.tags);

  // Save tasks to localStorage whenever the tasks array changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
    // Deselect task if it's deleted
    if (selectedTask && selectedTask.id === id) {
      setSelectedTask(tasks.length > 0 ? tasks[0] : null);
    }
  };

  const addTask = (text) => {
    if (!text) return; // Prevent adding empty tasks
    const newTask = {
      id: Date.now(),
      text,
      completed: false,
    };
    setTasks([...tasks, newTask]);
    changeSelectedTask(newTask); // Select the newly added task
  };

  const editTask = (id) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        return {
          ...task,
          text: taskTitle,
          description: taskDescription,
          list: taskList,
          dueDate: taskDueDate,
          tags: taskTags,
        };
      }
      return task;
    });
    setTasks(updatedTasks);
    setSelectedTask(updatedTasks.find((task) => task.id === id));
  };

  const changeSelectedTask = (task) => {
    setSelectedTask(task);
    setTaskTitle(task.text);
    setTaskDescription(task.description);
    setTaskList(task.list);
    setTaskDueDate(task.dueDate);
    setTaskTags(task.tags);
  };

  const resetTask = () => {
    setTaskTitle("");
  };

  const toggleCompleted = (id) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          return { ...task, completed: !task.completed };
        } else {
          return task;
        }
      })
    );
  };

  return (
    <div className="App">
      <Menu lists={fakeLists} />
      <MainView
        tasks={tasks}
        deleteTask={deleteTask}
        toggleCompleted={toggleCompleted}
        changeSelectedTask={changeSelectedTask}
        resetTask={resetTask}
      />
      <TaskView
        selectedTask={selectedTask}
        lists={fakeLists}
        deleteTask={deleteTask}
        addTask={addTask}
        editTask={editTask}
      />
    </div>
  );
};

export default App;
