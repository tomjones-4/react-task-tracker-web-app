import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import TagModal from "./TagModal";
import Modal from "./Modal";
import TaskFormButtons from "./TaskFormButtons";
import { List, Task, Tag } from "../types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaTrashAlt } from "react-icons/fa";

type TaskFormProps = {
  lists: List[];
  tags: Tag[];
  selectedListId: number;
  selectedTask: Task;
  deleteTask: (taskId: number) => void;
  isAddMode: boolean;
  addTask: (newTask: Task) => void;
  editTask: (editedTask: Task) => void;
  addTag: (newTag: Tag) => void;
  deleteTag: (tagId: number) => void;
};

export type TaskFormRef = {
  focusTitleInput: () => void;
};

const TaskForm = forwardRef<TaskFormRef, TaskFormProps>(
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
    const [taskTitle, setTaskTitle] = useState<string>(selectedTask.title);
    const [taskDescription, setTaskDescription] = useState<string>(
      selectedTask.description
    );
    const [taskListId, setTaskListId] = useState<number>(selectedListId);
    const [taskDueDate, setTaskDueDate] = useState<Date | null>(
      selectedTask.dueDate
    );
    const [taskTagIds, setTaskTagIds] = useState<number[]>(selectedTask.tagIds);
    const [dueDateEnabled, setDueDateEnabled] = useState<boolean>(false);
    const [isTagModalOpen, setIsTagModalOpen] = useState<boolean>(false);

    const [error, setError] = useState<string>("");
    const [wiggle, setWiggle] = useState<boolean>(false);

    useEffect(() => {
      if (selectedTask) {
        setTaskTitle(selectedTask.title);
        setTaskDescription(selectedTask.description);
        setTaskListId(selectedListId);
        setTaskDueDate(selectedTask.dueDate);
        setTaskTagIds(selectedTask.tagIds);
      }
    }, [selectedTask]);

    const showError = (message: string) => {
      setError(message);
      setWiggle(true);
      setTimeout(() => setWiggle(false), 400); // Remove class after animation
      taskTitleInputRef.current?.focus();
      taskTitleInputRef.current?.select();
    };

    useEffect(() => {
      if (taskTitle) {
        setError("");
      }
    }, [taskTitle]);

    const closeModal = () => setIsTagModalOpen(false);

    const handleAddTask = (
      e:
        | React.FormEvent<HTMLFormElement>
        | React.KeyboardEvent<HTMLInputElement>
        | React.KeyboardEvent<HTMLTextAreaElement>
    ) => {
      e.preventDefault();
      if (!taskTitle) {
        showError("Task title cannot be empty.");
        return;
      }
      const newTask: Task = {
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

    const handleEditTask = (
      e:
        | React.FormEvent<HTMLFormElement>
        | React.KeyboardEvent<HTMLInputElement>
        | React.KeyboardEvent<HTMLTextAreaElement>
    ) => {
      e.preventDefault();
      if (!taskTitle) {
        showError("Task title cannot be empty.");
        return;
      }
      const updatedTask: Task = {
        ...selectedTask,
        title: taskTitle,
        description: taskDescription,
        listId: taskListId,
        dueDate: taskDueDate,
        tagIds: taskTagIds,
      };
      editTask(updatedTask);
    };

    const addTaskTag = (newTaskTagId: number) => {
      setTaskTagIds(() => [...taskTagIds, newTaskTagId]);
    };

    const deleteTaskTag = (tagToDeleteId: number) => {
      setTaskTagIds(taskTagIds.filter((id) => id !== tagToDeleteId));
    };

    const taskTitleInputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => ({
      focusTitleInput() {
        taskTitleInputRef.current?.focus();
      },
    }));

    const handleKeyDown = (
      e:
        | React.KeyboardEvent<HTMLInputElement>
        | React.KeyboardEvent<HTMLTextAreaElement>
    ) => {
      if (e.key === "Enter") {
        isAddMode ? handleAddTask(e) : handleEditTask(e);
      }
    };

    return (
      <form
        id="task-form"
        className={`task-form ${wiggle ? "wiggle" : ""}`}
        onSubmit={isAddMode ? handleAddTask : handleEditTask}
      >
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
          <label htmlFor="tags" className="tags-label">
            Tags
          </label>
          <span className="tags">
            {taskTagIds
              .filter((id) => tags.some((tag) => tag.id === id)) // do this filter to avoid state sync issue where tag still exists in taskTagIds but not in tags, which happens briefly after tag is deleted
              .map((id) => tags.find((tag) => tag.id === id))
              .filter((tag): tag is Tag => tag !== undefined) // <-- type guard
              .map((tag) => (
                <span
                  key={tag.id}
                  className="tag"
                  style={{ backgroundColor: tag.color, fontWeight: "bold" }}
                >
                  {tag.name}
                  <button
                    className="trash-can-button"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      deleteTaskTag(tag.id);
                    }}
                  >
                    <FaTrashAlt className="delete-tag-icon" />
                  </button>
                </span>
              ))}
            <span
              key={0}
              className="tag"
              style={{ backgroundColor: "lightskyblue", fontWeight: "bold" }}
              onClick={(e) => {
                e.preventDefault();
                setIsTagModalOpen(true);
              }}
            >
              Add tag
            </span>
          </span>

          {isTagModalOpen && (
            <Modal closeModal={closeModal} wiggle={wiggle}>
              <TagModal
                tags={tags}
                addTag={addTag}
                deleteTag={deleteTag}
                addTaskTag={addTaskTag}
                taskTagIds={taskTagIds}
                closeModal={closeModal}
                setWiggle={setWiggle}
              />
            </Modal>
          )}
        </span>
        <TaskFormButtons
          deleteTask={deleteTask}
          selectedTaskId={selectedTask.id}
          isAddMode={isAddMode}
        />

        {error && <div className="error-message">{error}</div>}
      </form>
    );
  }
);

export default TaskForm;
