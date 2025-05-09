import React from "react";
import { FaPlus } from "react-icons/fa";

type AddSubtaskItemProps = {
  //   handleAddSubtask: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleAddSubtask: (e: React.MouseEvent<SVGElement>) => void;
  subTaskTitle: string;
  setSubtaskTitle: React.Dispatch<React.SetStateAction<string>>;
};

const AddSubtaskItem: React.FC<AddSubtaskItemProps> = ({
  handleAddSubtask,
  subTaskTitle,
  setSubtaskTitle,
}) => {
  return (
    <div className="add-task">
      <div>
        <FaPlus className="add-task-icon" onClick={handleAddSubtask} />
        <input
          className="TODO"
          ref={undefined} // TODO - fill this out if needed
          type="text"
          placeholder="Add New Subtask"
          value={subTaskTitle}
          onChange={(e) => setSubtaskTitle(e.target.value)}
        ></input>
      </div>
      <span className="ripple" />
    </div>
  );
};

export default AddSubtaskItem;
