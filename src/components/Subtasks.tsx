import React from "react";
import SubtaskList from "./SubtaskList";
import { Subtask } from "../types";

interface SubtasksProps {
  subtasks: Subtask[];
  setSubtasks: React.Dispatch<React.SetStateAction<Subtask[]>>;
  // setSelectedSubtask: React.Dispatch<React.SetStateAction<Subtask | undefined>>;
  // selectedSubtaskId: number | undefined;
  selectedTaskId: number;
  addSubtask: (newSubtask: Subtask) => void;
  editSubtask: (editedSubtask: Subtask) => void;
  deleteSubtask: (subtaskId: number) => void;
  toggleSubtaskCompleted: (subtaskId: number) => void;
  handleStartNewSubtask: (e: React.MouseEvent<HTMLDivElement>) => void;
  ripple: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const Subtasks: React.FC<SubtasksProps> = ({
  subtasks,
  setSubtasks,
  // setSelectedSubtask,
  // selectedSubtaskId,
  selectedTaskId,
  addSubtask,
  editSubtask,
  deleteSubtask,
  toggleSubtaskCompleted,
  handleStartNewSubtask,
  ripple,
}) => {
  return (
    <div className="subtasks-container">
      <h2>Subtasks:</h2>
      <SubtaskList
        subtasks={subtasks}
        setSubtasks={setSubtasks}
        // setSelectedSubtask={setSelectedSubtask}
        // selectedSubtaskId={selectedSubtaskId}
        selectedTaskId={selectedTaskId}
        addSubtask={addSubtask}
        editSubtask={editSubtask}
        deleteSubtask={deleteSubtask}
        toggleSubtaskCompleted={toggleSubtaskCompleted}
        // handleStartNewSubtask={handleStartNewSubtask}
        ripple={ripple}
      />
    </div>
  );
};

export default Subtasks;
