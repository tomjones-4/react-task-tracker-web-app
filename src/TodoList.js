import React, { useState, useEffect } from "react";
import TodoItem from "./TodoItem";

const LOCAL_STORAGE_KEY = "todoApp.tasks";

function TodoList() {
  // const [tasks, setTasks] = useState([
  //   {
  //     id: 1,
  //     text: "Doctor appointment",
  //     completed: true,
  //   },
  //   {
  //     id: 2,
  //     text: "Meeting at school",
  //     completed: false,
  //   },
  // ]);
  const [tasks, setTasks] = useState([]);

  const [text, setText] = useState("");

  // Load tasks from localStorage when the component mounts
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    if (storedTasks) {
      setTasks(storedTasks);
    }
  }, []);

  // Save tasks to localStorage whenever the tasks array changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  function addTask(text) {
    const newTask = {
      id: Date.now(),
      text,
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setText("");
  }

  function deleteTask(id) {
    setTasks(tasks.filter((task) => task.id !== id));
  }

  function toggleCompleted(id) {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          return { ...task, completed: !task.completed };
        } else {
          return task;
        }
      })
    );
  }

  // Sort tasks: incomplete ones first, then completed ones
  const sortedTasks = tasks.sort((a, b) => a.completed - b.completed);

  return (
    <div className="todo-list-container">
      <div className="todo-list">
        {sortedTasks.map((task) => (
          <TodoItem
            key={task.id}
            task={task}
            deleteTask={deleteTask}
            toggleCompleted={toggleCompleted}
          />
        ))}
        <input value={text} onChange={(e) => setText(e.target.value)} />
        <button onClick={() => addTask(text)}>Add</button>
      </div>
    </div>
  );
}

export default TodoList;
