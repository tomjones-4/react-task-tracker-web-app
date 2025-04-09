import { useState } from "react";

const TaskForm = ({
  lists,
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
}) => {
  const [dueDateEnabled, setDueDateEnabled] = useState(false);

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
        className="task-form-item"
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
          <input
            type="checkbox"
            id="enable-due-date"
            onChange={(e) => setDueDateEnabled(e.target.checked)}
          />{" "}
          Due date?
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

      <label htmlFor="tags" className="task-form-item">
        Tags
      </label>
      <input
        type="text"
        id="tags"
        name="tags"
        placeholder="Add tags..."
        className="task-form-item"
      />
    </form>
  );
};

export default TaskForm;
