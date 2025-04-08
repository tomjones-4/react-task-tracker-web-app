import { useState } from "react";

const TodoForm = ({ lists, selectedTask, taskText, setTaskText }) => {
  const [dueDateEnabled, setDueDateEnabled] = useState(false);

  return (
    <form id="todo-form" className="todo-form">
      <input
        type="text"
        name="title"
        value={selectedTask.title}
        placeholder="Title"
        required
        className="todo-form-item"
        // onChange={(e) => setTaskText(e.target.value)}
        // onChange={(e) => editTask(e.target.value)}
      />

      <textarea
        name="description"
        placeholder="Description"
        className="todo-form-item"
      ></textarea>

      <span className="todo-form-item">
        <label htmlFor="list-select">List</label>
        <select id="list-select" name="list">
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
