import React, { useState, useEffect } from "react";
import TodoItem from "./TodoItem.jsx";
import AddTodoItem from "./AddTodoItem.jsx";

function TodoList({ tasks, setTasks, setSelectedTask }) {
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
        <AddTodoItem setTasks={setTasks} tasks={tasks} />
        {sortedTasks.map((task) => (
          <TodoItem
            key={task.id}
            task={task}
            deleteTask={deleteTask}
            toggleCompleted={toggleCompleted}
            setSelectedTask={setSelectedTask}
          />
        ))}
      </div>
    </div>
  );
}

export default TodoList;
