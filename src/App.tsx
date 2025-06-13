// TODO

/* High Priority */
// I'll probably need to change how the dragging and dropping reordering is done for filtering by tag.
// Consider implementing search
// Clean up code
// Document project on GitHub
/* End High Priority */

/* Medium Priority */
// Think about actually reordering the tasks when a user marks a task as completed. Currently the tasks are only sorted visually, but if I made that change using setTask I think it would be easier to delete tasks in the right order.
// Add option for user to hide completed tasks instead of showing them crossed out (This could live in the settings tab, or just be a toggle for the selected list - in that case list UI would probably need more state added to it, possibly in App.tsx)
// Add a tag filter when "All tasks" is selected in the sidebar
// Use highlights to show tasks that are getting old or are due urgently.
/* Think about making selected task something that's always selected (behavior would be that if a list doesn't have any tasks, it defauls to adding task with resetTask() method).
   I think this could be achieved by having selectedTaskId = -1 when there is no task selected, and that's how app knows to show AddTask form.
  This probably also aligns better with only having selected task ids for tasks that actually exist, and not tasks that are going to be added. */
/* End Medium Priority */

/* Low Priority */
// Consider adding a reset task button on the task form.
// Consider changing the structure of tasks. Is it necessary to have all the task ids associated with them on the task? That info is sort of double tracked, since each task has a list id.
// See if Drag and Drop reordering can handle completed subtasks. The crossing them off that makes them jump to bottom of the list, and then when they're deleted, the task to delete jumps around instead of smoothly moving up or down 1 spot.
// Refactor whatever logic is shared between lists and tags modals.
// Add authentication - require a user to login. This will require Supabase. TBD if this is necessary or overkill.
// Have the lists show up in a different way from the tags. TBD if this is ncessary.
// Add tooltips when user is getting started with app
// Maybe change favicon?
// Make it so ids for tasks, lists, tags, etc. are unique and incremented by 1 instead of using Date.now() (This is important for when we add the ability to edit tasks, since we need to be able to find the task in the array by id.) THIS REQUIRES SUPABASE INTEGRATION - this will be a big one
/* End Low Priority */

/* Begin Constants */

import "./App.css";
import Menu from "./components/Menu";
import ResizableSplitView from "./components/ResizableSplitView";
import MainView from "./components/MainView";
import TaskView from "./components/TaskView";
import React, { useState, useEffect, useRef } from "react";
import { List, Task, Subtask, Tag, Time } from "./types";

export const SPECIAL_LIST_ID_ALL_TASKS: number = -1;
const SPECIAL_LIST_ID_UNCATEGORIZED_TASKS: number = 0;

export const TASK_VERY_HIGH_PRIORITY: number = 1;
export const TASK_HIGH_PRIORITY: number = 2;
export const TASK_MEDIUM_PRIORITY: number = 3;
export const TASK_LOW_PRIORITY: number = 4;
export const TASK_VERY_LOW_PRIORITY: number = 5;

const SPECIAL_LISTS: List[] = [
  {
    id: SPECIAL_LIST_ID_ALL_TASKS,
    name: "All Tasks",
    color: "white",
    taskIds: [],
  },
  {
    id: SPECIAL_LIST_ID_UNCATEGORIZED_TASKS,
    name: "Uncategorized Tasks",
    color: "gray",
    taskIds: [],
  },
];

const LOCAL_STORAGE_KEY_LISTS = "todoApp.lists";
const LOCAL_STORAGE_KEY_TASKS = "todoApp.tasks";
const LOCAL_STORAGE_KEY_SUBTASKS = "todoApp.subtasks";
const LOCAL_STORAGE_KEY_TAGS = "todoApp.tags";
const LOCAL_STORAGE_KEY_AUTOMATIC_SORTING = "todoApp.automaticSorting";
const LOCAL_STORAGE_KEY_DARK_MODE = "todoApp.darkMode";

const DUMMY_TASK: Task = {
  id: -2,
  completed: false,
  title: "Tend to the garden",
  description: "Water the plants and remove weeds",
  listId: SPECIAL_LIST_ID_UNCATEGORIZED_TASKS,
  priority: TASK_MEDIUM_PRIORITY,
  dueDate: null,
  startTime: null,
  endTime: null,
  tagIds: [],
};

const EMPTY_TASK: Task = {
  id: -1,
  completed: false,
  title: "",
  description: "",
  listId: SPECIAL_LIST_ID_UNCATEGORIZED_TASKS,
  priority: TASK_MEDIUM_PRIORITY,
  dueDate: null,
  startTime: null,
  endTime: null,
  tagIds: [],
};

/* End Constants */

const App = () => {
  /* Begin Specific Types */

  interface TaskFormRef {
    focusTitleInput: () => void;
  }

  interface SearchInputRef {
    focusSearchInput: () => void;
  }

  /* End Specific Types */

  /* Begin State Variables */

  // Uncomment below lines and then refresh page to reset lists, tasks, and tags. This is helpful when the structures of these objects change, since it can cause errors.
  // When uncommenting this line, comment out the blocks below it that sets the lists, tasks, and tags based on localStorage.

  // const [lists, setLists] = useState(SPECIAL_LISTS);
  // const [tasks, setTasks] = useState([DUMMY_TASK]);
  // const [subtasks, setSubtasks] = useState([]);
  // const [tags, setTags] = useState([]);

  const [lists, setLists] = useState<List[]>(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY_LISTS);
    let storedLists: List[] = [];

    if (stored) {
      try {
        storedLists = JSON.parse(stored) as List[];
      } catch (e) {
        console.error("Failed to parse stored lists:", e);
      }
    }

    // Check if special lists are already in storedLists
    const specialListIds = SPECIAL_LISTS.map((list) => list.id);
    const hasSpecialLists = storedLists.some((list) =>
      specialListIds.includes(list.id)
    );

    if (!hasSpecialLists) {
      return [...SPECIAL_LISTS, ...storedLists];
    } else {
      return storedLists;
    }
  });

  const [hasLoadedTasks, setHasLoadedTasks] = useState<boolean>(false);

  const [tasks, setTasks] = useState<Task[]>(() => {
    const normalizeTask = (task: Partial<Task>): Task => ({
      id: task.id!,
      title: task.title!,
      description: task.description ?? "",
      listId: task.listId!,
      completed: task.completed ?? false,
      dueDate: task.dueDate ?? null,
      startTime: task.startTime ?? null,
      endTime: task.endTime ?? null,
      priority: task.priority ?? TASK_MEDIUM_PRIORITY,
      tagIds: task.tagIds ?? [],
    });
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY_TASKS);
    let storedTasks: Task[] = [];

    if (stored) {
      try {
        const parsed: Partial<Task>[] = JSON.parse(stored);
        storedTasks = parsed.map(normalizeTask);
        setHasLoadedTasks(true); // Set to true after tasks are loaded
      } catch (e) {
        console.error("Failed to parse stored tasks:", e);
      }
    }
    return storedTasks;
  });

  const [subtasks, setSubtasks] = useState<Subtask[]>(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY_SUBTASKS);
    let storedSubtasks: Subtask[] = [];

    if (stored) {
      try {
        storedSubtasks = JSON.parse(stored) as Subtask[];
      } catch (e) {
        console.error("Failed to parse stored subtasks:", e);
      }
    }
    return storedSubtasks;
  });

  const [tags, setTags] = useState<Tag[]>(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY_TAGS);
    let storedTags: Tag[] = [];

    if (stored) {
      try {
        storedTags = JSON.parse(stored) as Tag[];
      } catch (e) {
        console.error("Failed to parse stored tags:", e);
      }
    }
    return storedTags;
  });

  const [selectedList, setSelectedList] = useState<List>(lists[0]);

  const [selectedTask, setSelectedTask] = useState<Task | undefined>(
    tasks.length > 0 ? tasks[0] : EMPTY_TASK
  );

  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

  const [showCalendarView, setShowCalendarView] = useState<boolean>(false);

  const [automaticSorting, setAutomaticSorting] = useState<boolean>(() => {
    // Load from localStorage on first load
    return localStorage.getItem(LOCAL_STORAGE_KEY_AUTOMATIC_SORTING) === "auto";
  });

  const [darkMode, setDarkMode] = useState(() => {
    // Load from localStorage on first load
    return localStorage.getItem(LOCAL_STORAGE_KEY_DARK_MODE) === "dark";
  });

  const [isAddMode, setIsAddMode] = useState<boolean>(true);

  /* End State Variables */

  /* Begin Refs */

  const taskFormRef = useRef<TaskFormRef>(null);
  const searchInputRef = useRef<SearchInputRef>(null);

  /* End Refs */

  /* Begin Functions */

  const addList = (newList: List) => {
    setLists([...lists.slice(0, -1), newList, lists[lists.length - 1]]); // Add the new list before the last element (Uncategorized Tasks)
    // TODO - delete above line and uncomment below line if I want tasks to be added to end of list - this can be good since tasks can be reordered
    //setLists([...lists, newList]);
    setSelectedList(newList); // Select the newly added list
    resetTask(newList.id); // Reset the task view to add a new task
  };

  const deleteList = (listId: number) => {
    if (
      listId === SPECIAL_LIST_ID_ALL_TASKS ||
      listId === SPECIAL_LIST_ID_UNCATEGORIZED_TASKS
    )
      return;
    const deletedList = lists.find((list: List) => list.id === listId);
    if (!deletedList) {
      console.warn("No list found to delete");
      return;
    }

    // Select new list if selected list is deleted
    if (selectedList.id === listId) {
      const indexInList = lists.indexOf(deletedList);
      if (indexInList === -1) {
        console.warn("No position in list found when deleting list");
        return;
      }

      if (lists.length <= 1) {
        // this shouldn't ever happen because All Tasks and Uncategorized Tasks lists cannot be deleted
        resetTask();
      } else {
        const listToSelect =
          lists[
            indexInList < lists.length - 1 ? indexInList + 1 : indexInList - 1
          ];

        if (!listToSelect) {
          console.warn("No list found when looking to select new list");
          return;
        }
        setSelectedList(listToSelect);
      }
    }

    // Update tasks to remove the deleted list from them and assign their list ID as Uncategorized Tasks
    const updatedTasks = tasks.map((task) =>
      task.listId === deletedList.id
        ? { ...task, listId: SPECIAL_LIST_ID_UNCATEGORIZED_TASKS }
        : task
    );
    setTasks(updatedTasks);

    // Move tasks over to Uncategorized Tasks list
    addTasksToList(
      SPECIAL_LIST_ID_UNCATEGORIZED_TASKS,
      deletedList.taskIds,
      false
    );

    setLists((prevLists) =>
      prevLists.filter((list: List) => list.id !== listId)
    );
  };

  const addTasksToList = (
    listId: number,
    taskIds: number[],
    changeAllTasksList: boolean = true
  ) => {
    const updatedLists: List[] = lists.map((list: List) => {
      if (list.id === listId || (list.id === -1 && changeAllTasksList)) {
        return {
          ...list,
          taskIds: [...list.taskIds, ...taskIds],
        };
      }
      return list;
    });
    setLists(updatedLists);
  };

  const removeTasksFromList = (
    listId: number,
    taskIds: number[],
    changeAllTasksList: boolean = true
  ) => {
    console.log("listId", listId);
    console.log("taskIds", taskIds);
    const updatedLists: List[] = lists.map((list: List) => {
      if (
        list.id === listId ||
        (changeAllTasksList && list.id === SPECIAL_LIST_ID_ALL_TASKS)
      ) {
        return {
          ...list,
          taskIds: list.taskIds.filter(
            (taskId: number) => !taskIds.includes(taskId)
          ),
        };
      }
      return list;
    });
    setLists(updatedLists);
  };

  const moveTasksBetweenLists = (
    oldListId: number,
    newListId: number,
    taskIds: number[]
  ) => {
    const updatedLists: List[] = lists.map((list: List) => {
      if (list.id === oldListId) {
        return {
          ...list,
          taskIds: list.taskIds.filter(
            (taskId: number) => !taskIds.includes(taskId)
          ),
        };
      } else if (list.id === newListId) {
        return {
          ...list,
          taskIds: [...list.taskIds, ...taskIds],
        };
      }
      return list;
    });
    setLists(updatedLists);
  };

  const changeSelectedList = (list: List) => {
    setSelectedList(list);
    if (list.taskIds.length === 0) {
      resetTask(list.id);
    } else {
      if (list.id !== SPECIAL_LIST_ID_ALL_TASKS) {
        const taskIdToSelect = listSelectedTasksIds[list.id];
        if (taskIdToSelect) {
          const taskToSelect = tasks.find((t: Task) => t.id === taskIdToSelect);
          if (taskToSelect) {
            setSelectedTask(taskToSelect);
          } else {
            console.log("No taskToSelect found");
          }
        } else {
          const firstTaskIdInList = list.taskIds[0];
          const firstTaskInList = tasks.find(
            (t: Task) => t.id === firstTaskIdInList
          );
          setSelectedTask(firstTaskInList);
        }

        setIsAddMode(false);
      }
    }
  };

  useEffect(() => {
    if (selectedTask && selectedList.id === SPECIAL_LIST_ID_ALL_TASKS) {
      const listIdForTask = tasks.find(
        (task: Task) => task.id === selectedTask.id
      )?.listId;
      if (listIdForTask === undefined) {
        console.warn("No list found for task");
        return;
      }

      setListSelectedTaskIds((prevIds) => ({
        ...prevIds,
        [listIdForTask]: selectedTask.id,
      }));

      return;
    }
    if (selectedTask) {
      setListSelectedTaskIds((prevIds) => ({
        ...prevIds,
        [selectedList.id]: selectedTask.id,
      }));
    }
  }, [selectedTask]);

  const addTag = (newTag: Tag) => {
    setTags([...tags, newTag]);
  };

  const deleteTag = (tagId: number) => {
    // Remove the tag from all tasks that have it
    const updatedTasks = tasks.map((task: Task) => {
      return {
        ...task,
        tagIds: task.tagIds.filter((id: number) => id != tagId),
      };
    });
    setTasks(updatedTasks);

    const updatedTags = tags.filter((tag: Tag) => tag.id !== tagId);
    setTags(updatedTags);
  };

  const deleteTask = (taskId: number) => {
    const taskToDelete = tasks.find((task: Task) => task.id === taskId);
    if (!taskToDelete) {
      console.error("No task found to delete");
      return;
    }

    // Select new task if selected task is deleted
    if (selectedTask && selectedTask.id === taskId) {
      const tasksInList = getTasksByListId(taskToDelete.listId);
      const indexInList = tasksInList.indexOf(taskToDelete);

      if (indexInList === -1) {
        console.warn("No position in list found when deleting task");
        return;
      }

      if (tasksInList.length <= 1) {
        resetTask();
      } else {
        const taskToSelect =
          tasksInList[
            indexInList < tasksInList.length - 1
              ? indexInList + 1
              : indexInList - 1
          ];

        if (!taskToSelect) {
          console.warn("No task found when looking to select new task");
          return;
        }
        setSelectedTask(taskToSelect);
      }
    }

    removeTasksFromList(taskToDelete.listId, [taskId]);
    setTasks(tasks.filter((task: Task) => task.id !== taskId));
  };

  const deleteSubtask = (subtaskId: number) => {
    setSubtasks(
      subtasks.filter((subtask: Subtask) => subtask.id !== subtaskId)
    );
  };

  const addTask = (newTask: Task) => {
    if (!newTask) return; // Prevent adding empty tasks
    setTasks([...tasks, newTask]);
    addTasksToList(newTask.listId, [newTask.id]);
    const listForNewTask = lists.find(
      (list: List) => list.id === newTask.listId
    );
    if (listForNewTask && selectedList.id !== SPECIAL_LIST_ID_ALL_TASKS) {
      changeSelectedList(listForNewTask); // Select the newly added task's list
    }
    setIsAddMode(false);
    setSelectedTask(newTask); // Select the newly added task
  };

  const addSubtask = (newSubtask: Subtask) => {
    if (!newSubtask) return; // Prevent adding empty subtasks
    setSubtasks([...subtasks, newSubtask]);
  };

  const editTask = (editedTask: Task) => {
    const formerTask = tasks.find((task) => task.id === editedTask.id);
    if (!formerTask) {
      console.error("No task found in editTask method");
      return;
    }
    const updatedTasks = tasks.map((task: Task) => {
      if (task.id === editedTask.id) {
        return {
          ...task,
          title: editedTask.title,
          description: editedTask.description,
          listId: editedTask.listId,
          priority: editedTask.priority,
          dueDate: editedTask.dueDate,
          startTime: editedTask.startTime,
          endTime: editedTask.endTime,
          tagIds: editedTask.tagIds,
        };
      }
      return task;
    });
    setTasks(updatedTasks);
    setSelectedTask(editedTask);
    if (editedTask.listId !== formerTask.listId) {
      moveTasksBetweenLists(formerTask.listId, editedTask.listId, [
        editedTask.id,
      ]);
    }
  };

  const editSubtask = (editedSubtask: Subtask) => {
    const updatedSubtasks = subtasks.map((subtask: Subtask) => {
      if (subtask.id === editedSubtask.id) {
        return {
          ...subtask,
          title: editedSubtask.title,
        };
      }
      return subtask;
    });
    setSubtasks(updatedSubtasks);
  };

  const linkNewSubtasksToTask = (taskId: number) => {
    const newSubtasks = subtasks
      .filter((subtask: Subtask) => subtask.taskId === -1)
      .map((subtask: Subtask) => ({
        ...subtask,
        taskId: taskId, // Link the new subtask to the current task
      }));
    setSubtasks([
      ...subtasks.filter((subtask: Subtask) => subtask.taskId !== -1),
      ...newSubtasks,
    ]);
  };

  const resetTask = (
    newListId: number = selectedList.id,
    dueDate: Date | null = null,
    startTime: Time | null = null,
    endTime: Time | null = null
  ) => {
    const newTask: Task = {
      id: -1,
      completed: false,
      title: "",
      description: "",
      listId: newListId, // Set the listId to the currently selected list
      priority: TASK_MEDIUM_PRIORITY,
      dueDate: dueDate,
      startTime: startTime,
      endTime: endTime,
      tagIds: [],
    };
    setSelectedTask(newTask);
    setIsAddMode(true);
  };

  const handleStartNewTask = (e: React.MouseEvent<HTMLDivElement>) => {
    ripple(e);
    resetTask();
    taskFormRef.current?.focusTitleInput(); // Focus the title input
  };

  const onCalendarCreateTask = (
    startDate: Date,
    startTime?: Time,
    endTime?: Time
  ) => {
    resetTask(selectedList.id, startDate, startTime, endTime);
    taskFormRef.current?.focusTitleInput(); // Focus the title input
  };

  const toggleCompleted = (taskId: number) => {
    setTasks(
      tasks.map((task: Task) => {
        if (task.id === taskId) {
          return { ...task, completed: !task.completed };
        } else {
          return task;
        }
      })
    );
  };

  const toggleSubtaskCompleted = (subtaskId: number) => {
    setSubtasks(
      subtasks.map((subtask: Subtask) => {
        if (subtask.id === subtaskId) {
          return { ...subtask, completed: !subtask.completed };
        } else {
          return subtask;
        }
      })
    );
  };

  const getTasksByListId = (listId: number) => {
    if (listId === -1) {
      return tasks; // Return all tasks for "All Tasks" list
    }
    return tasks.filter((task) => task.listId === listId);
  };

  const filterTasksByTagIds = (tasks: Task[], tagIds: number[]) => {
    if (tagIds.length === 0) return tasks;
    const selectedTagIdSet = new Set(selectedTagIds);
    return tasks.filter((task) =>
      task.tagIds.some((tagId) => selectedTagIdSet.has(tagId))
    );
  };

  const filterTasksByListAndTags = (listId: number, tagIds: number[]) => {
    const tasksForList = getTasksByListId(listId);
    return filterTasksByTagIds(tasksForList, tagIds);
  };

  const getSubtasksByTaskId = (taskId: number) => {
    return subtasks.filter((subtask) => subtask.taskId === taskId);
  };

  /* End Functions */

  /* Begin front-end effects */

  const ripple = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const ripple = target.querySelector(".ripple");
    if (!(ripple instanceof HTMLSpanElement)) {
      console.warn("Ripple not found or not an HTMLDivElement");
      return;
    }

    // Get click coordinates relative to the target element
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Position the ripple at the click point
    ripple.style.top = `${y}px`;
    ripple.style.left = `${x}px`;

    // Reset the ripple animation
    ripple.classList.remove("ripple-animate");
    void ripple.offsetWidth; // reflow to restart animation
    ripple.classList.add("ripple-animate");
  };

  const [listSelectedTasksIds, setListSelectedTaskIds] = useState<number[]>([]);
  const [listScrollPositions, setListScrollPositions] = useState<number[]>([]);

  /* End front-end effects */

  /* Begin Initialization */

  // if (tasks.length == 0) {
  //   const newTask = {
  //     id: Date.now(),
  //     completed: false,
  //     title: "Tend to the garden",
  //     description: "Water the plants and remove weeds",
  //     listId: 0,
  //     dueDate: "",
  //     tagIds: [],
  //   };
  //   addTask(newTask);
  //   setSelectedTask(newTask);
  // }

  /* End Initialization */

  /* Begin seEffect Hooks */

  // Save lists to localStorage whenever the lists array changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_LISTS, JSON.stringify(lists));
  }, [lists]);

  // Save tasks to localStorage whenever the tasks array changes
  useEffect(() => {
    if (!hasLoadedTasks) return; // Prevent saving if tasks weren't properly loaded
    localStorage.setItem(LOCAL_STORAGE_KEY_TASKS, JSON.stringify(tasks));
  }, [tasks]);

  // Save subtasks to localStorage whenever the subtasks array changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_SUBTASKS, JSON.stringify(subtasks));
  }, [subtasks]);

  // Save tags to localStorage whenever the tags array changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_TAGS, JSON.stringify(tags));
  }, [tags]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/") {
        const target = e.target as HTMLElement | null;
        if (
          target &&
          (target.tagName.toLowerCase() === "input" ||
            target.tagName.toLowerCase() === "textarea" ||
            target.isContentEditable)
        ) {
          // Don't trigger shortcut if focused on input, textarea, or contenteditable
          return;
        }
        e.preventDefault();
        searchInputRef.current?.focusSearchInput(); // Focus the search input
        return;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_KEY_AUTOMATIC_SORTING,
      automaticSorting ? "auto" : "manual"
    );
  }, [automaticSorting]);

  useEffect(() => {
    const className = "dark";
    if (darkMode) {
      document.body.classList.add(className);
      localStorage.setItem(LOCAL_STORAGE_KEY_DARK_MODE, "dark");
    } else {
      document.body.classList.remove(className);
      localStorage.setItem(LOCAL_STORAGE_KEY_DARK_MODE, "light");
    }
  }, [darkMode]);

  /* End useEffect Hooks */

  /* Begin Debugging */

  // const testfunction = () => {
  //   console.log("test THISSSS");
  //   setTasks(tasks.slice(0, 2));
  //   console.log(tasks.slice(0, 2));
  // };

  /* End Debugging */

  return (
    <div className="App">
      <aside>
        <Menu
          lists={lists}
          setLists={setLists}
          addList={addList}
          deleteList={deleteList}
          changeSelectedList={changeSelectedList}
          selectedListId={selectedList.id}
          ripple={ripple}
          showCalendarView={showCalendarView}
          setShowCalendarView={setShowCalendarView}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          automaticSorting={automaticSorting}
          setAutomaticSorting={setAutomaticSorting}
          tags={tags}
          addTag={addTag}
          deleteTag={deleteTag}
          selectedTagIds={selectedTagIds}
          setSelectedTagIds={setSelectedTagIds}
          ref={searchInputRef}
        />
      </aside>

      {selectedTask ? (
        <ResizableSplitView
          left={
            <MainView
              selectedList={selectedList}
              tasks={filterTasksByListAndTags(selectedList.id, selectedTagIds)}
              setTasks={setTasks}
              subtasks={subtasks}
              setSubtasks={setSubtasks}
              selectedTaskId={selectedTask?.id}
              deleteTask={deleteTask}
              toggleCompleted={toggleCompleted}
              toggleSubtaskCompleted={toggleSubtaskCompleted}
              setSelectedTask={setSelectedTask}
              handleStartNewTask={handleStartNewTask}
              tags={tags}
              selectedTaskForDebug={selectedTask}
              setIsAddMode={setIsAddMode}
              ripple={ripple}
              listScrollPositions={listScrollPositions}
              setListScrollPositions={setListScrollPositions}
              showCalendarView={showCalendarView}
              onCalendarCreateTask={onCalendarCreateTask}
              automaticSorting={automaticSorting}
            />
          }
          right={
            <TaskView
              selectedListId={selectedList.id === -1 ? 0 : selectedList.id}
              selectedTask={selectedTask}
              lists={lists}
              tags={tags}
              deleteTask={deleteTask}
              addTask={addTask}
              editTask={editTask}
              isAddMode={isAddMode}
              addTag={addTag}
              deleteTag={deleteTag}
              subtasks={getSubtasksByTaskId(selectedTask.id)}
              setSubtasks={setSubtasks}
              addSubtask={addSubtask}
              editSubtask={editSubtask}
              deleteSubtask={deleteSubtask}
              toggleSubtaskCompleted={toggleSubtaskCompleted}
              linkNewSubtasksToTask={linkNewSubtasksToTask}
              automaticSorting={automaticSorting}
              ref={taskFormRef}
            />
          }
        />
      ) : (
        <MainView
          selectedList={selectedList}
          tasks={filterTasksByListAndTags(selectedList.id, selectedTagIds)}
          setTasks={setTasks}
          subtasks={subtasks}
          setSubtasks={setSubtasks}
          selectedTaskId={undefined}
          deleteTask={deleteTask}
          toggleCompleted={toggleCompleted}
          toggleSubtaskCompleted={toggleSubtaskCompleted}
          setSelectedTask={setSelectedTask}
          handleStartNewTask={handleStartNewTask}
          tags={tags}
          selectedTaskForDebug={selectedTask}
          setIsAddMode={setIsAddMode}
          ripple={ripple}
          listScrollPositions={listScrollPositions}
          setListScrollPositions={setListScrollPositions}
          showCalendarView={showCalendarView}
          onCalendarCreateTask={onCalendarCreateTask}
          automaticSorting={automaticSorting}
        />
      )}
    </div>
  );
};

export default App;
