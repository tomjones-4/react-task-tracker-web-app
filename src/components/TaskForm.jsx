import { useState } from "react";
import AddTagsModal from "./AddTagsModal";

const TaskForm = ({
  lists,
  tags,
  taskTitle,
  setTaskTitle,
  taskDescription,
  setTaskDescription,
  taskList,
  setTaskList,
  taskDueDate,
  setTaskDueDate,
  taskTags,
  setTaskTags,
  addTag,
  deleteTag,
}) => {
  const [dueDateEnabled, setDueDateEnabled] = useState(false);
  const [isAddTagModalOpen, setIsAddTagModalOpen] = useState(false);

  const closeModal = () => setIsAddTagModalOpen(false);

  return (
    <form id="task-form" className="task-form">
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={taskTitle}
        required
        className="task-form-item"
        onChange={(e) => setTaskTitle(e.target.value)}
      />

      <textarea
        name="description"
        placeholder="Description"
        value={taskDescription}
        className="task-form-item task-form-description"
        onChange={(e) => setTaskDescription(e.target.value)}
      ></textarea>

      <span className="task-form-item">
        <label htmlFor="list-select">List</label>
        <select
          id="list-select"
          name="list"
          value={taskList}
          onSelect={(e) => setTaskList(e.target.value)}
        >
          <option value="" />
          {lists.map((list) => (
            <option key={list.id} value={list.id}>
              {list.name}
            </option>
          ))}
        </select>
      </span>

      <span className="task-form-item">
        <label>
          Due date?
          <input
            className="due-date-checkbox"
            type="checkbox"
            id="enable-due-date"
            onChange={(e) => setDueDateEnabled(e.target.checked)}
          />{" "}
        </label>
        <input
          type="date"
          id="due-date"
          name="dueDate"
          value={taskDueDate}
          onChange={(e) => setTaskDueDate(e.target.value)}
          disabled={!dueDateEnabled}
        />
      </span>

      <span className="task-form-item">
        <label htmlFor="tags" className="">
          Tags
        </label>
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsAddTagModalOpen(true);
          }}
        >
          Add Tag
        </button>
        {isAddTagModalOpen && (
          <AddTagsModal
            tags={tags}
            addTag={addTag}
            deleteTag={deleteTag}
            closeModal={closeModal}
          />
        )}
      </span>
    </form>
  );
};

export default TaskForm;
