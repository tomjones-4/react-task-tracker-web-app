import React, { useState, useEffect } from "react";
import TodoItem from "./TodoItem.jsx";
import AddTodoItem from "./AddTodoItem.jsx";

const TodoList = ({
  tasks,
  setSelectedTask,
  deleteTask,
  addTask,
  toggleCompleted,
  text,
  setText,
}) => {
  // Sort tasks: incomplete ones first, then completed ones
  const sortedTasks = tasks.sort((a, b) => a.completed - b.completed);

  return (
    <div className="todo-list-container">
      <div className="todo-list">
        <AddTodoItem addTask={addTask} text={text} setText={setText} />
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
};

export default TodoList;
