import React, { useState, useEffect } from "react";
import TaskItem from "./TaskItem.jsx";
import AddTaskItem from "./AddTaskItem.jsx";

const TaskList = ({
  tasks,
  deleteTask,
  toggleCompleted,
  setSelectedTask,
  resetTask,
}) => {
  // Sort tasks: incomplete ones first, then completed ones
  const sortedTasks = tasks.sort((a, b) => a.completed - b.completed);

  return (
    <div className="task-list-container">
      <div className="task-list">
        <AddTaskItem resetTask={resetTask} />
        {sortedTasks.map((task) => (
          <TaskItem
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

export default TaskList;
