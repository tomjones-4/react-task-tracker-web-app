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
  taskTagIds,
  setTaskTagIds,
  addTag,
  deleteTag,
}) => {
  const [dueDateEnabled, setDueDateEnabled] = useState(false);
  const [isAddTagModalOpen, setIsAddTagModalOpen] = useState(false);

  const closeModal = () => setIsAddTagModalOpen(false);

  const addTaskTag = (newTaskTagId) => {
    setTaskTagIds(() => [...taskTagIds, newTaskTagId]);
  };

  const deleteTaskTag = (tagToDeleteId) => {
    setTaskTagIds((prevTagIds) =>
      prevTagIds.filter((id) => id !== tagToDeleteId)
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
          {taskTagIds
            .filter((id) => tags.some((tag) => tag.id === id)) // do this filter to avoid state sync issue where tag still exists in taskTagIds but not in tags, which happens briefly after tag is deleted
            .map((id) => tags.find((tag) => tag.id === id))
            .map((tag) => (
              <span
                key={tag.id}
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
            taskTagIds={taskTagIds}
            closeModal={closeModal}
          />
        )}
      </span>
    </form>
  );
};

export default TaskForm;
