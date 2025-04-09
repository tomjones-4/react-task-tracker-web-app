import "./App.css";
import Menu from "./components/Menu.jsx";
import MainView from "./components/MainView.jsx";
import TaskView from "./components/TaskView.jsx";
import { useState, useEffect } from "react";

// TODO
// Distinguish between adding and editing tasks

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

  const [isAddMode, setIsAddMode] = useState(true);

  // const [taskTitle, setTaskTitle] = useState(selectedTask.text);
  // const [taskDescription, setTaskDescription] = useState(
  //   selectedTask.description
  // );
  // const [taskList, setTaskList] = useState(selectedTask.list);
  // const [taskDueDate, setTaskDueDate] = useState(selectedTask.dueDate);
  // const [taskTags, setTaskTags] = useState(selectedTask.tags);

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

  // const addTask = (text) => {
  //   if (!text) return; // Prevent adding empty tasks
  //   const newTask = {
  //     id: Date.now(),
  //     text,
  //     completed: false,
  //   };
  //   setTasks([...tasks, newTask]);
  //   setSelectedTask(newTask); // Select the newly added task
  // };

  const addTask = (newTask) => {
    if (!newTask) return; // Prevent adding empty tasks
    setTasks([...tasks, newTask]);
    setSelectedTask(newTask); // Select the newly added task
  };

  const editTask = (editedTask) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === editedTask.id) {
        return {
          ...task,
          title: editedTask.title,
          description: editedTask.description,
          list: editedTask.list,
          dueDate: editedTask.dueDate,
          tags: editedTask.tags,
        };
      }
      return task;
    });
    setTasks(updatedTasks);
    setSelectedTask(updatedTasks.find((task) => task.id === editedTask.id));
  };

  const resetTask = () => {
    const newTask = {
      id: Date.now(),
      completed: false,
      title: "",
      description: "",
      list: "",
      dueDate: "",
      tags: "",
    };
    setSelectedTask(newTask);
    setIsAddMode(true);
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

  // const testfunction = () => {
  //   console.log("test THISSSS");
  //   setTasks(tasks.slice(0, 2));
  //   console.log(tasks.slice(0, 2));
  // };

  return (
    <div className="App">
      <Menu lists={fakeLists} />
      <MainView
        tasks={tasks}
        deleteTask={deleteTask}
        toggleCompleted={toggleCompleted}
        setSelectedTask={setSelectedTask}
        resetTask={resetTask}
        selectedTaskForDebug={selectedTask}
        setIsAddMode={setIsAddMode}
      />
      <TaskView
        selectedTask={selectedTask}
        lists={fakeLists}
        deleteTask={deleteTask}
        addTask={addTask}
        editTask={editTask}
        isAddMode={isAddMode}
      />
    </div>
  );
};

export default App;
