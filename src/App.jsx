import logo from "./logo.svg";
import "./App.css";
import Menu from "./components/Menu.jsx";
import MainView from "./components/MainView.jsx";
import TaskView from "./components/TaskView.jsx";
import { useState, useEffect } from "react";

function App() {
  const LOCAL_STORAGE_KEY = "todoApp.tasks";
  const [tasks, setTasks] = useState(() => {
    const storedTasks = localStorage.getItem(LOCAL_STORAGE_KEY);
    return storedTasks ? JSON.parse(storedTasks) : []; // Load from localStorage or default to []
  });

  const fakeLists = [
    { id: 1, name: "List 1", color: "blue", length: 3 },
    { id: 2, name: "List 2", color: "red", length: 6 },
  ];

  // Save tasks to localStorage whenever the tasks array changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
    console.log("Saved tasks to localStorage:", tasks);
  }, [tasks]);

  const [selectedTask, setSelectedTask] = useState(
    tasks.length > 0 ? tasks[0] : null
  );

  return (
    <div className="App">
      <Menu lists={fakeLists} />
      <MainView
        tasks={tasks}
        setTasks={setTasks}
        setSelectedTask={setSelectedTask}
      />
      <TaskView selectedTask={selectedTask} lists={fakeLists} />
    </div>
  );
}

export default App;
