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
}

const Subtasks: React.FC<SubtasksProps> = ({
  subtasks,
  setSubtasks,
  selectedTaskId,
  addSubtask,
  editSubtask,
  deleteSubtask,
  toggleSubtaskCompleted,
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
      />
    </div>
  );
};

export default Subtasks;
