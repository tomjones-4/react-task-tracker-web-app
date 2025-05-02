import React from "react";

const TaskFormButtons = ({
  deleteTask,
  selectedTaskId,
  isAddMode,
  handleEditTask,
  handleAddTask,
}) => {
  return (
    <div className="task-form-buttons-container">
      <button
        className="task-button delete-task-button"
        onClick={(e) => deleteTask(selectedTaskId)}
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
  );
};

export default TaskFormButtons;
