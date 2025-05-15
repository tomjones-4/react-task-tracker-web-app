import React from "react";
import SubtaskList from "./SubtaskList";
import { Subtask } from "../types";

interface SubtasksProps {
  subtasks: Subtask[];
  setSubtasks: React.Dispatch<React.SetStateAction<Subtask[]>>;
  selectedTaskId: number;
  addSubtask: (newSubtask: Subtask) => void;
  editSubtask: (editedSubtask: Subtask) => void;
  deleteSubtask: (subtaskId: number) => void;
  toggleSubtaskCompleted: (subtaskId: number) => void;
  showError: (message: string) => void;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

const Subtasks: React.FC<SubtasksProps> = ({
  subtasks,
  setSubtasks,
  selectedTaskId,
  addSubtask,
  editSubtask,
  deleteSubtask,
  toggleSubtaskCompleted,
  showError,
  setError,
}) => {
  return (
    <div className="subtasks-container">
      <h2>Subtasks:</h2>
      <SubtaskList
        subtasks={subtasks}
        setSubtasks={setSubtasks}
        selectedTaskId={selectedTaskId}
        addSubtask={addSubtask}
        editSubtask={editSubtask}
        deleteSubtask={deleteSubtask}
        toggleSubtaskCompleted={toggleSubtaskCompleted}
        showError={showError}
        setError={setError}
      />
    </div>
  );
};

export default Subtasks;
