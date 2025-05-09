import React from "react";
import SubtaskList from "./SubtaskList";
import { Subtask } from "../types";

interface SubtasksProps {
  subtasks: Subtask[];
  setSubtasks: React.Dispatch<React.SetStateAction<Subtask[]>>;
  // setSelectedSubtask: React.Dispatch<React.SetStateAction<Subtask | undefined>>;
  // selectedSubtaskId: number | undefined;
  selectedTaskId: number;
  deleteSubtask: (subtaskId: number) => void;
  toggleSubtaskCompleted: (subtaskId: number) => void;
  handleStartNewSubtask: (e: React.MouseEvent<HTMLDivElement>) => void;
  // setIsAddMode: React.Dispatch<React.SetStateAction<boolean>>;
  ripple: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const Subtasks: React.FC<SubtasksProps> = ({
  subtasks,
  setSubtasks,
  // setSelectedSubtask,
  // selectedSubtaskId,
  selectedTaskId,
  deleteSubtask,
  toggleSubtaskCompleted,

  handleStartNewSubtask,
  // setIsAddMode,
  ripple,
}) => {
  return (
    <div>
      <h2>Subtasks</h2>
      <SubtaskList
        subtasks={subtasks}
        setSubtasks={setSubtasks}
        // setSelectedSubtask={setSelectedSubtask}
        // addSubtask={addSubtask}
        // selectedSubtaskId={selectedSubtaskId}
        selectedTaskId={selectedTaskId}
        deleteSubtask={deleteSubtask}
        toggleSubtaskCompleted={toggleSubtaskCompleted}
        handleStartNewSubtask={handleStartNewSubtask}
        // setIsAddMode={setIsAddMode}
        ripple={ripple}
      />
    </div>
  );
};

export default Subtasks;
