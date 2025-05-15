import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { Subtask } from "../types";

type AddSubtaskItemProps = {
  addSubtask: (newSubtask: Subtask) => void;
  selectedTaskId: number;
  showError: (message: string) => void;
  setError: React.Dispatch<React.SetStateAction<string>>;
};

const AddSubtaskItem: React.FC<AddSubtaskItemProps> = ({
  addSubtask,
  selectedTaskId,
  showError,
  setError,
}) => {
  const [newSubtaskTitle, setNewSubtaskTitle] = useState<string>("");

  const handleAddSubtask = (
    e: React.MouseEvent<SVGElement> | React.KeyboardEvent<HTMLInputElement>
  ) => {
    e.preventDefault();

    if (!newSubtaskTitle) {
      showError("Subtask cannot be empty.");
      return;
    }

    const newSubtask: Subtask = {
      id: Date.now(),
      completed: false,
      title: newSubtaskTitle,
      taskId: selectedTaskId,
    };

    // clear new subtask input
    setNewSubtaskTitle("");
    addSubtask(newSubtask);
  };

  useEffect(() => {
    if (newSubtaskTitle) {
      setError("");
    }
  }, [newSubtaskTitle]);

  useEffect(() => {
    if (selectedTaskId) {
      setNewSubtaskTitle("");
    }
  }, [selectedTaskId]);

  return (
    <div className="add-subtask">
      <FaPlus className="add-task-icon" onClick={(e) => handleAddSubtask(e)} />
      <input
        className="add-subtask-input"
        type="text"
        placeholder="Add New Subtask"
        value={newSubtaskTitle}
        onChange={(e) => setNewSubtaskTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleAddSubtask(e);
        }}
      ></input>
    </div>
  );
};

export default AddSubtaskItem;
