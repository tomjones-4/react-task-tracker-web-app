import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { Subtask } from "../types";

type AddSubtaskItemProps = {
  addSubtask: (newSubtask: Subtask) => void;
  selectedTaskId: number;
  ripple: (e: React.MouseEvent<HTMLDivElement>) => void;
};

const AddSubtaskItem: React.FC<AddSubtaskItemProps> = ({
  addSubtask,
  selectedTaskId,
  ripple,
}) => {
  const [newSubtaskTitle, setNewSubtaskTitle] = useState<string>("");

  // TODO - make it so subtasks can be added with "Enter" hotkey
  const handleAddSubtask = (
    e: React.MouseEvent<SVGElement> | React.KeyboardEvent<HTMLInputElement>,
    subtaskTitle: string
  ) => {
    e.preventDefault();
    if (!subtaskTitle) {
      // TODO - use better error handling
      alert("Subtask title cannot be empty. TODO - use better error handling.");
      // showError("Subtask title cannot be empty.");
      return;
    }
    const newSubtask: Subtask = {
      id: Date.now(),
      completed: false,
      title: subtaskTitle,
      taskId: selectedTaskId,
    };

    // clear new subtask input
    setNewSubtaskTitle("");
    addSubtask(newSubtask);
  };

  useEffect(() => {
    if (selectedTaskId) {
      setNewSubtaskTitle("");
    }
  }, [selectedTaskId]);
  return (
    <div className="add-subtask">
      <FaPlus
        className="add-task-icon"
        onClick={(e) => handleAddSubtask(e, newSubtaskTitle)}
      />
      <input
        className="add-subtask-input"
        ref={undefined} // TODO - fill this out if needed
        type="text"
        placeholder="Add New Subtask"
        value={newSubtaskTitle}
        onChange={(e) => setNewSubtaskTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleAddSubtask(e, newSubtaskTitle);
        }}
      ></input>
      <span className="ripple" />
    </div>
  );
};

export default AddSubtaskItem;
