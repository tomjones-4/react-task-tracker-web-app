import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import TagModal from "./TagModal";
import TaskFormButtons from "./TaskFormButtons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TaskForm = forwardRef(
  (
    {
      lists,
      tags,
      selectedListId,
      selectedTask,
      deleteTask,
      isAddMode,
      addTask,
      editTask,
      addTag,
      deleteTag,
    },
    ref
  ) => {
    const [taskTitle, setTaskTitle] = useState(selectedTask.title);
    const [taskDescription, setTaskDescription] = useState(
      selectedTask.description
    );
    const [taskListId, setTaskListId] = useState(selectedListId);
    const [taskDueDate, setTaskDueDate] = useState(selectedTask.dueDate);
    const [taskTagIds, setTaskTagIds] = useState(selectedTask.tagIds);
    const [dueDateEnabled, setDueDateEnabled] = useState(false);
    const [isTagModalOpen, setIsTagModalOpen] = useState(false);

    const [error, setError] = useState("");

    useEffect(() => {
      if (selectedTask) {
        setTaskTitle(selectedTask.title || "");
        setTaskDescription(selectedTask.description || "");
        setTaskListId(selectedListId || 0);
        setTaskDueDate(selectedTask.dueDate || "");
        setTaskTagIds(selectedTask.tagIds || []);
      }
    }, [selectedTask]);

    useEffect(() => {
      if (taskTitle) {
        setError("");
      }
    }, [taskTitle]);

    const closeModal = () => setIsTagModalOpen(false);

    const handleAddTask = () => {
      if (!taskTitle) {
        setError("Task title cannot be empty.");
        return;
      }
      const newTask = {
        id: Date.now(),
        completed: false,
        title: taskTitle,
        description: taskDescription,
        listId: taskListId,
        dueDate: taskDueDate,
        tagIds: taskTagIds,
      };
      addTask(newTask);
    };

    const handleEditTask = () => {
      if (!taskTitle) {
        setError("Task title cannot be empty.");
        return;
      }
      const updatedTask = {
        ...selectedTask,
        title: taskTitle,
        description: taskDescription,
        listId: taskListId,
        dueDate: taskDueDate,
        tagIds: taskTagIds,
      };
      editTask(updatedTask);
    };

    const addTaskTag = (newTaskTagId) => {
      setTaskTagIds(() => [...taskTagIds, newTaskTagId]);
    };

    const deleteTaskTag = (tagToDeleteId) => {
      setTaskTagIds(taskTagIds.filter((id) => id !== tagToDeleteId));
    };

    const taskTitleInputRef = useRef(null);
    useImperativeHandle(ref, () => ({
      focusTitleInput() {
        taskTitleInputRef.current?.focus();
      },
    }));

    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault(); // Prevent form submission
        isAddMode ? handleAddTask() : handleEditTask();
      }
    };

    return (
      <form id="task-form" className="task-form">
        <input
          ref={taskTitleInputRef}
          type="text"
          name="title"
          placeholder="Title"
          value={taskTitle}
          required
          className="task-form-item"
          onChange={(e) => setTaskTitle(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <textarea
          name="description"
          placeholder="Description"
          value={taskDescription}
          className="task-form-item task-form-description"
          onChange={(e) => setTaskDescription(e.target.value)}
          onKeyDown={handleKeyDown}
        ></textarea>

        <span className="task-form-item">
          <label htmlFor="list-select">List</label>
          <select
            id="list-select"
            name="list"
            value={String(taskListId)}
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
          <DatePicker
            className="datepicker-input"
            calendarClassName="datepicker-calendar"
            selected={taskDueDate}
            onChange={(date) => setTaskDueDate(date)}
            placeholderText="Select a due date"
            dateFormat="MMMM d, yyyy"
            isClearable
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
                      deleteTaskTag(tag.id);
                    }}
                  >
                    &times;
                  </button>
                </span>
              ))}
            <button
              className="add-tag-button"
              onClick={(e) => {
                e.preventDefault();
                setIsTagModalOpen(true);
              }}
            >
              Add Tag
            </button>
          </span>
          {isTagModalOpen && (
            <TagModal
              tags={tags}
              addTag={addTag}
              deleteTag={deleteTag}
              addTaskTag={addTaskTag}
              taskTagIds={taskTagIds}
              closeModal={closeModal}
            />
          )}
        </span>
        <TaskFormButtons
          taskTitle={taskTitle}
          deleteTask={deleteTask}
          selectedTaskId={selectedTask.id}
          isAddMode={isAddMode}
          handleEditTask={handleEditTask}
          handleAddTask={handleAddTask}
        />

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}
      </form>
    );
  }
);

export default TaskForm;
