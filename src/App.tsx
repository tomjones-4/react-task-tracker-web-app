// TODO

/* High Priority */
// Allow tasks to have subtasks. (See the mockup on Github)
// Fix the expanding/shrinking of the 3 main components: Menu, TaskView, and MainView. MainView gets totally cut off.
// Need to fix the bottom of menu too. It should be rounded like Task View
/* End High Priority */

/* Medium Priority */
// Add authentication - require a user to login. This will require Supabase.
// Make it so ids for tasks, lists, tags, etc. are unique and incremented by 1 instead of using Date.now() (This is important for when we add the ability to edit tasks, since we need to be able to find the task in the array by id.) THIS REQUIRES SUPABASE INTEGRATION - this will be a big one
// Add option for user to hide completed tasks instead of showing them crossed out (This could live in the settings tab)
// Add a tag filter when "All tasks" is selected in the sidebar
// Consider adding a calendar view in place of the task list. This would probably be a very large code change, but it would be a sweet feature.
/* End Medium Priority */

/* Low Priority */
// Consider adding a reset task button on the task form.
// Have the lists show up in a different way from the tags. Refactor whatever logic is shared between lists and tags modals
// Consider using Headless UI for the modal and dropdown components. This would make it easier to style them and make them more accessible.
// Use highlights to show tasks that are getting old or are due urgently.
// Allow users to take advantage of keyboard shortcuts like "Esc" to clear inputs or exit modes.

/* End Low Priority */

/* Begin Constants */

import "./App.css";
import Menu from "./components/Menu.jsx";
import ResizableSplitView from "./components/ResizableSplitView";
import MainView from "./components/MainView.jsx";
import TaskView from "./components/TaskView.jsx";
import React, { useState, useEffect, useRef } from "react";
import { List, Task, Tag } from "./types";

export const SPECIAL_LIST_ID_ALL_TASKS = -1;
const SPECIAL_LIST_ID_UNCATEGORIZED = 0;

const SPECIAL_LISTS: List[] = [
  {
    id: SPECIAL_LIST_ID_ALL_TASKS,
    name: "All Tasks",
    color: "white",
    taskIds: [-1],
  },
  {
    id: SPECIAL_LIST_ID_UNCATEGORIZED,
    name: "Uncategorized",
    color: "gray",
    taskIds: [-1],
  },
];

const LOCAL_STORAGE_KEY_LISTS = "todoApp.lists";
const LOCAL_STORAGE_KEY_TASKS = "todoApp.tasks";
const LOCAL_STORAGE_KEY_TAGS = "todoApp.tags";
// const LOCAL_STORAGE_KEY_SETTINGS = "todoApp.settings";
// const LOCAL_STORAGE_KEY_THEME = "todoApp.theme";

const dummyTask: Task = {
  id: -1,
  completed: false,
  title: "Tend to the garden",
  description: "Water the plants and remove weeds",
  listId: 0,
  dueDate: null,
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
  // const [tasks, setTasks] = useState([dummyTask]);
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

  const [tasks, setTasks] = useState<Task[]>(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY_TASKS);
    let storedTasks: Task[] = [];

    if (stored) {
      try {
        storedTasks = JSON.parse(stored) as Task[];
      } catch (e) {
        console.error("Failed to parse stored tasks:", e);
      }
    }
    return storedTasks;
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
    tasks.find((task) => task.id === selectedList.id) || undefined
  );

  const [isAddMode, setIsAddMode] = useState<boolean>(true);

  /* End State Variables */

  /* Begin Refs */

  const taskFormRef = useRef<TaskFormRef>(null);
  const searchInputRef = useRef<SearchInputRef>(null);

  /* End Refs */

  /* Begin Functions */

  const addList = (newList: List) => {
    setLists([...lists.slice(0, -1), newList, lists[lists.length - 1]]); // Add the new list before the last element (Uncategorized)
    setSelectedList(newList); // Select the newly added list
    resetTask(newList.id); // Reset the task view to add a new task
  };

  const deleteList = (listId: number) => {
    if (
      listId === SPECIAL_LIST_ID_ALL_TASKS ||
      listId === SPECIAL_LIST_ID_UNCATEGORIZED
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
        resetTask();
      } else {
        const listToSelect = lists[indexInList + 1];
        if (!listToSelect) {
          console.warn("No list found when looking to select new list");
          return;
        }
        setSelectedList(listToSelect);
      }
    }

    // Update tasks to remove the deleted list from them and assign their list ID as Uncategorized
    const updatedTasks = tasks.map((task) =>
      task.listId === deletedList.id
        ? { ...task, listId: SPECIAL_LIST_ID_UNCATEGORIZED }
        : task
    );
    setTasks(updatedTasks);

    // Move tasks over to uncategorized list
    addTasksToList(0, deletedList.taskIds, false);

    setLists((prevLists) =>
      prevLists.filter((list: List) => list.id !== listId)
    );
  };

  const addTasksToList = (
    listId: number,
    taskIds: number[],
    changeAllTasksList: boolean = true
  ) => {
    console.log("listId", listId);
    console.log("taskIds", taskIds);
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
      setIsAddMode(false);
    }
  };

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
    if (!taskToDelete) return;

    // Select new task if selected task is deleted
    if (selectedTask && selectedTask.id === taskId) {
      const taskList = lists.find((list) => list.id === taskToDelete.listId);
      if (!taskList) {
        console.error("No list found for deleted task");
        return;
      }

      const indexInList = taskList.taskIds.indexOf(taskId);
      if (indexInList === -1) {
        console.warn("No position in list found when deleting task");
        return;
      }

      if (taskList.taskIds.length <= 1) {
        resetTask();
      } else {
        const taskToSelect = tasks.find(
          (task: Task) =>
            task.id ===
            taskList.taskIds[
              indexInList < taskList.taskIds.length - 1
                ? indexInList + 1
                : indexInList - 1
            ]
        );

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

  const addTask = (newTask: Task) => {
    if (!newTask) return; // Prevent adding empty tasks
    setTasks([...tasks, newTask]);
    addTasksToList(newTask.listId, [newTask.id]);
    const listForNewTask = lists.find(
      (list: List) => list.id === newTask.listId
    );
    if (listForNewTask) {
      changeSelectedList(listForNewTask); // Select the newly added task's list
    }
    setIsAddMode(false);
    setSelectedTask(newTask); // Select the newly added task
  };

  const editTask = (editedTask: Task) => {
    const formerTask = tasks.find((task) => task.id === editedTask.id);
    if (!formerTask) {
      console.error("No task found in editTask method");
      return;
    }
    const updatedTasks = tasks.map((task) => {
      if (task.id === editedTask.id) {
        return {
          ...task,
          title: editedTask.title,
          description: editedTask.description,
          listId: editedTask.listId,
          dueDate: editedTask.dueDate,
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

  const resetTask = (newListId: number = selectedList.id) => {
    const newTask: Task = {
      id: Date.now(),
      completed: false,
      title: "",
      description: "",
      listId: newListId, // Set the listId to the currently selected list
      dueDate: null,
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

  const getTasksByListId = (listId: number) => {
    if (listId === -1) {
      return tasks; // Return all tasks for "All Tasks" list
    }
    return tasks.filter((task) => task.listId === listId);
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

  // Save tasks to localStorage whenever the tasks array changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_TASKS, JSON.stringify(tasks));
  }, [tasks]);

  // Save tags to localStorage whenever the tags array changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_TAGS, JSON.stringify(tags));
  }, [tags]);

  // Save lists to localStorage whenever the lists array changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_LISTS, JSON.stringify(lists));
  }, [lists]);

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
      // TODO - eventually include functionality for "Escape" key
      // if (event.key === "Escape") {
      //   setSelectedTask(tasks[0]); // Reset to the first task
      //   setIsAddMode(false);
      //   searchInputRef.current?.focus(); // Focus the search input
      //   return;
      // }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

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
          ref={searchInputRef}
        />
      </aside>

      {selectedTask ? (
        <ResizableSplitView
          left={
            <MainView
              selectedList={selectedList}
              tasks={getTasksByListId(selectedList.id)}
              setTasks={setTasks}
              selectedTaskId={selectedTask?.id}
              deleteTask={deleteTask}
              toggleCompleted={toggleCompleted}
              setSelectedTask={setSelectedTask}
              handleStartNewTask={handleStartNewTask}
              selectedTaskForDebug={selectedTask}
              setIsAddMode={setIsAddMode}
              ripple={ripple}
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
              ref={taskFormRef}
            />
          }
        />
      ) : (
        <MainView
          selectedList={selectedList}
          tasks={getTasksByListId(selectedList.id)}
          setTasks={setTasks}
          selectedTaskId={undefined}
          deleteTask={deleteTask}
          toggleCompleted={toggleCompleted}
          setSelectedTask={setSelectedTask}
          handleStartNewTask={handleStartNewTask}
          selectedTaskForDebug={selectedTask}
          setIsAddMode={setIsAddMode}
          ripple={ripple}
        />
      )}
    </div>
  );
};

export default App;
