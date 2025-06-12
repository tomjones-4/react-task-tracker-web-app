import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import TagModal from "./TagModal";
import Modal from "./Modal";
import TaskFormButtons from "./TaskFormButtons";
import { List, Task, Subtask, Tag, Time } from "../types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaTrashAlt } from "react-icons/fa";
import Subtasks from "./Subtasks";
import TimePicker from "./TimePicker";
import Tooltip from "./Tooltip";
import {
  TASK_VERY_HIGH_PRIORITY,
  TASK_HIGH_PRIORITY,
  TASK_MEDIUM_PRIORITY,
  TASK_LOW_PRIORITY,
  TASK_VERY_LOW_PRIORITY,
} from "../App";

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
  subtasks: Subtask[];
  setSubtasks: React.Dispatch<React.SetStateAction<Subtask[]>>;
  addSubtask: (newSubtask: Subtask) => void;
  editSubtask: (editedSubtask: Subtask) => void;
  deleteSubtask: (subtaskId: number) => void;
  toggleSubtaskCompleted: (subtaskId: number) => void;
  linkNewSubtasksToTask: (taskId: number) => void; // Optional prop for associating new subtasks with the task
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
      subtasks,
      setSubtasks,
      addSubtask,
      editSubtask,
      deleteSubtask,
      toggleSubtaskCompleted,
      linkNewSubtasksToTask,
    },
    ref
  ) => {
    const [taskTitle, setTaskTitle] = useState<string>(selectedTask.title);
    const [taskDescription, setTaskDescription] = useState<string>(
      selectedTask.description
    );
    const [taskListId, setTaskListId] = useState<number>(selectedListId);
    const [taskPriority, setTaskPriority] = useState<number | null>(
      selectedTask.priority ?? TASK_MEDIUM_PRIORITY
    );
    const [taskDueDate, setTaskDueDate] = useState<Date | null>(
      selectedTask.dueDate
    );
    const [taskStartTime, setTaskStartTime] = useState<Time>(
      selectedTask.startTime
        ? selectedTask.startTime
        : { hour: 12, minute: 0, ampm: "AM" }
    );
    const [taskEndTime, setTaskEndTime] = useState<Time>(
      selectedTask.endTime
        ? selectedTask.endTime
        : { hour: 12, minute: 0, ampm: "AM" }
    );
    const [taskTagIds, setTaskTagIds] = useState<number[]>(selectedTask.tagIds);
    const [dueDateChecked, setdueDateChecked] = useState<boolean>(
      selectedTask.dueDate !== null
    );
    const [startTimeChecked, setStartTimeChecked] = useState<boolean>(
      selectedTask.startTime !== null && selectedTask.startTime !== undefined
    );
    const [endTimeChecked, setEndTimeChecked] = useState<boolean>(
      selectedTask.endTime !== null && selectedTask.endTime !== undefined
    );

    // console.log("selectedTask.startTime", selectedTask.startTime);
    // console.log("selectedTask.endTime", selectedTask.endTime);
    // console.log("taskStartTime", taskStartTime);
    // console.log("taskEndTime", taskEndTime);
    // console.log("dueDateChecked", dueDateChecked);
    // console.log("startTimeChecked", startTimeChecked);
    // console.log("endTimeChecked", endTimeChecked);
    const [isTagModalOpen, setIsTagModalOpen] = useState<boolean>(false);

    const [error, setError] = useState<string>("");
    const [wiggle, setWiggle] = useState<boolean>(false);

    useEffect(() => {
      if (selectedTask) {
        setTaskTitle(selectedTask.title);
        setTaskDescription(selectedTask.description);
        setTaskListId(selectedListId);
        setTaskPriority(selectedTask.priority ?? TASK_MEDIUM_PRIORITY); // Default to low priority if not set
        setTaskDueDate(selectedTask.dueDate);
        setTaskStartTime(
          selectedTask.startTime
            ? selectedTask.startTime
            : { hour: 12, minute: 0, ampm: "AM" }
        );
        setTaskEndTime(
          selectedTask.endTime
            ? selectedTask.endTime
            : { hour: 12, minute: 0, ampm: "AM" }
        );
        setTaskTagIds(selectedTask.tagIds);
        setdueDateChecked(selectedTask.dueDate !== null);
        setStartTimeChecked(
          selectedTask.startTime !== null &&
            selectedTask.startTime !== undefined
        );
        setEndTimeChecked(
          selectedTask.endTime !== null && selectedTask.endTime !== undefined
        );
      }
    }, [selectedTask.id]); // TODO - BE CAREFUL OF THIS CHANGE. I HAVEN'T TESTED TO SEE IF IT WORKS AS EXPECTED. THE REASON I DID IT WAS TO SEE IF I COULD JUST HAVE TIMES RESET WHEN TASK IS CHANGED RATHER THAN WHEN SOMETHING ABOUT THE TASK CHANGES.

    useEffect(() => {
      if (!dueDateChecked) {
        setTaskDueDate(null);
        setStartTimeChecked(false);
        setEndTimeChecked(false);
      }
    }, [dueDateChecked]);

    const showError = (message: string) => {
      setError(message);
      setWiggle(true);
      setTimeout(() => setWiggle(false), 400); // Remove class after animation
    };

    const focusElement = (ref: React.RefObject<HTMLInputElement | null>) => {
      ref.current?.focus();
      ref.current?.select();
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
        focusElement(taskTitleInputRef);
        return;
      }
      const newTask: Task = {
        id: Date.now(),
        completed: false,
        title: taskTitle,
        description: taskDescription,
        listId: taskListId,
        priority: taskPriority,
        dueDate: taskDueDate,
        startTime: startTimeChecked ? taskStartTime : null,
        endTime: endTimeChecked ? taskEndTime : null,
        tagIds: taskTagIds,
      };
      addTask(newTask);
      linkNewSubtasksToTask(newTask.id);
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
        focusElement(taskTitleInputRef);
        return;
      }
      const updatedTask: Task = {
        ...selectedTask,
        title: taskTitle,
        description: taskDescription,
        listId: taskListId,
        priority: taskPriority,
        dueDate: taskDueDate,
        startTime: startTimeChecked ? taskStartTime : null,
        endTime: endTimeChecked ? taskEndTime : null,
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
        <div className="form-inputs">
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
            <label htmlFor="priority-select">Priority</label>
            <select
              id="priority-select"
              name="priority"
              //value={String(taskPriority)}
              value={taskPriority ?? TASK_MEDIUM_PRIORITY} // Use nullish coalescing to default to medium priority if taskPriority is null or undefined
              onChange={(e) => setTaskPriority(Number(e.target.value))}
            >
              <option value={TASK_VERY_HIGH_PRIORITY}>Very High - 1</option>
              <option value={TASK_HIGH_PRIORITY}>High - 2</option>
              <option value={TASK_MEDIUM_PRIORITY}>Medium - 3</option>
              <option value={TASK_LOW_PRIORITY}>Low - 4</option>
              <option value={TASK_VERY_LOW_PRIORITY}>Very Low - 5</option>
            </select>
          </span>

          <span className="task-form-item">
            <label>
              Due date?
              <input
                className="due-date-checkbox"
                type="checkbox"
                id="enable-due-date"
                checked={dueDateChecked}
                onChange={(e) => setdueDateChecked(e.target.checked)}
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
              disabled={!dueDateChecked}
            />
          </span>

          <span className="task-form-item">
            <span className="start-time-container">
              <span className="start-time-label">
                <label>
                  Start time?
                  <input
                    className="due-date-checkbox"
                    type="checkbox"
                    checked={startTimeChecked}
                    onChange={(e) => setStartTimeChecked(e.target.checked)}
                    disabled={!dueDateChecked}
                  />{" "}
                </label>
                <Tooltip text="To set start and end times, due date must be set."></Tooltip>
              </span>
              <TimePicker
                value={taskStartTime}
                onChange={setTaskStartTime}
                disabled={!startTimeChecked}
              />
            </span>
            <span className="end-time-container">
              <label>
                End time?
                <input
                  className="due-date-checkbox"
                  type="checkbox"
                  checked={endTimeChecked}
                  onChange={(e) => setEndTimeChecked(e.target.checked)}
                  disabled={!dueDateChecked}
                />{" "}
              </label>
              <TimePicker
                value={taskEndTime}
                onChange={setTaskEndTime}
                disabled={!endTimeChecked}
              />
            </span>
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
        </div>
        <Subtasks
          subtasks={subtasks}
          setSubtasks={setSubtasks}
          selectedTaskId={selectedTask.id}
          addSubtask={addSubtask}
          editSubtask={editSubtask}
          deleteSubtask={deleteSubtask}
          toggleSubtaskCompleted={toggleSubtaskCompleted}
          showError={showError}
          setError={setError}
        />
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
