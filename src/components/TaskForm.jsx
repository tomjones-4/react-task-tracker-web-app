import { useState } from "react";
import AddTagsModal from "./AddTagsModal";

const TaskForm = ({
  lists,
  tags,
  selectedListId,
  taskTitle,
  setTaskTitle,
  taskDescription,
  setTaskDescription,
  taskListId,
  setTaskListId,
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

  const addTaskTag = (newTaskTag) => {
    setTaskTags(() => [...taskTags, newTaskTag]);
  };

  const deleteTaskTag = (tagToDelete) => {
    setTaskTags((prevTags) =>
      prevTags.filter((tag) => tag.name !== tagToDelete.name)
    );
  };

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
          value={String(taskListId)}
          // TODO - need to make it so list is set correctly when adding a new task
          //value={String(selectedListId)}
          onChange={(e) => setTaskListId(Number(e.target.value))}
        >
          {lists.slice(1).map((list) => (
            <option key={String(list.id)} value={String(list.id)}>
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
        <label htmlFor="tags">Tags</label>
        <span>
          {taskTags.length > 0 &&
            taskTags.map((tag, i) => (
              <span
                key={i}
                className="tag"
                style={{ backgroundColor: tag.color, fontWeight: "bold" }}
              >
                {tag.name}
                <button
                  className="delete-tag-button"
                  onClick={(e) => {
                    e.preventDefault();
                    deleteTaskTag(tag);
                  }}
                >
                  &times;
                </button>
              </span>
            ))}
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsAddTagModalOpen(true);
            }}
          >
            Add Tag
          </button>
        </span>
        {isAddTagModalOpen && (
          <AddTagsModal
            tags={tags}
            addTag={addTag}
            deleteTag={deleteTag}
            addTaskTag={addTaskTag}
            closeModal={closeModal}
          />
        )}
      </span>
    </form>
  );
};

export default TaskForm;
