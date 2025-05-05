import React from "react";

type TaskFormButtonsProps = {
  deleteTask: (taskId: number) => void;
  selectedTaskId: number;
  isAddMode: boolean;
};

const TaskFormButtons: React.FC<TaskFormButtonsProps> = ({
  deleteTask,
  selectedTaskId,
  isAddMode,
}) => {
  return (
    <div className="task-form-buttons-container">
      <button
        className="task-button delete-task-button"
        type="button"
        onClick={(e) => deleteTask(selectedTaskId)}
      >
        Delete task
      </button>
      {!isAddMode && (
        <button type="submit" className="task-button save-task-button">
          Save changes
        </button>
      )}
      {isAddMode && (
        <button type="submit" className="task-button save-task-button">
          Add new task
        </button>
      )}
    </div>
  );
};

export default TaskFormButtons;
