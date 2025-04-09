import { useState } from "react";

const TodoForm = ({
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
    <form id="todo-form" className="todo-form">
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={taskTitle}
        required
        className="todo-form-item"
        onChange={(e) => setTaskTitle(e.target.value)}
      />

      <textarea
        name="description"
        placeholder="Description"
        value={taskDescription}
        className="todo-form-item"
        onChange={(e) => setTaskDescription(e.target.value)}
      ></textarea>

      <span className="todo-form-item">
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

      <span className="todo-form-item">
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

      <label htmlFor="tags" className="todo-form-item">
        Tags
      </label>
      <input
        type="text"
        id="tags"
        name="tags"
        placeholder="Add tags..."
        className="todo-form-item"
      />
    </form>
  );
};

export default TodoForm;
