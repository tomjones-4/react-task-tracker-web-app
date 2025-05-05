import "./App.css";
import Menu from "./components/Menu.jsx";
import MainView from "./components/MainView.jsx";
import TaskView from "./components/TaskView.jsx";
import { useState, useEffect, useRef } from "react";

// TODO

/* High Priority */
// Need to handle the case where there is no selected task. Right now the code assumes there will always be a selected task, which causes errors if there are no tasks.
/* End High Priority */

/* Medium Priority */
// Add authentication - require a user to login. This will require Supabase.
// Make it so when a task is deleted, the next task in the list is highlighted rather than the first one
// Make it so when a list is deleted, the next list in the menu is highlighted rather than the first one
// Make it so when a user switches between lists, the selected task is the same per list. This might use logic similar to scroll positions.
// I think the above 3 tasks all require keeping track of the task ids in each list, which will be a bit of a refactor. I can get rid of the count property, but I'll need to add a taskIds of type int[] to each list.
// Add option for user to hide completed tasks instead of showing them crossed out (This could live in the settings tab)
// Make it so ids for tasks, lists, tags, etc. are unique and incremented by 1 instead of using Date.now() (This is important for when we add the ability to edit tasks, since we need to be able to find the task in the array by id.) THIS REQUIRES SUPABASE INTEGRATION - this will be a big one
// Add a tag filter when "All tasks" is selected in the sidebar
// Allow tasks to have subtasks. (See the mockup on Github)
/* End Medium Priority */

/* Low Priority */
// Consider adding a reset task button on the task form.
// Have the lists show up in a different way from the tags.
// Refactor whatever logic is shared between lists and tags modals
// Consider using Headless UI for the modal and dropdown components. This would make it easier to style them and make them more accessible.
// Improve the UX when a user adds tons of tags. Currently it overflows and looks ugly.
// Improve the UX for color picker.
// Use highlights to show tasks that are getting old or are due urgently.
// Allow users to take advantage of keyboard shortcuts like "Enter" to submit a task, "/" to search, and "Esc" to clear inputs or exit modes.

/* End Low Priority */

const App = () => {
  /* Begin Constants */

  const LOCAL_STORAGE_KEY_TASKS = "todoApp.tasks";
  const LOCAL_STORAGE_KEY_TAGS = "todoApp.tags";
  const LOCAL_STORAGE_KEY_LISTS = "todoApp.lists";
  // const LOCAL_STORAGE_KEY_SETTINGS = "todoApp.settings";
  // const LOCAL_STORAGE_KEY_THEME = "todoApp.theme";

  const SPECIAL_LISTS = [
    { id: -1, name: "All Tasks", color: "black", count: 1 },
    { id: 0, name: "Uncategorized", color: "gray", count: 1 },
  ];

  const dummyTask = {
    id: Date.now(),
    completed: false,
    title: "Tend to the garden",
    description: "Water the plants and remove weeds",
    listId: 0,
    dueDate: "",
    tagIds: [],
  };

  /* End Constants */

  /* Begin State Variables */

  // Uncomment below lines and then refresh page to reset tags, tasks, and lists. This is helpful when the structures of these objects change, since it can cause errors.
  // When uncommenting this line, comment out the blocks below it that sets the tasks, tags, and lists based on localStorage.

  // const [tags, setTags] = useState([]);
  // const [tasks, setTasks] = useState([dummyTask]);
  // const [lists, setLists] = useState(SPECIAL_LISTS);

  const [tags, setTags] = useState(() => {
    const storedTags = localStorage.getItem(LOCAL_STORAGE_KEY_TAGS);
    return storedTags ? JSON.parse(storedTags) : []; // Load from localStorage or default to []
  });

  const [tasks, setTasks] = useState(() => {
    const storedTasks = localStorage.getItem(LOCAL_STORAGE_KEY_TASKS);
    return storedTasks ? JSON.parse(storedTasks) : []; // Load from localStorage or default to []
  });

  const [lists, setLists] = useState(() => {
    let storedLists = localStorage.getItem(LOCAL_STORAGE_KEY_LISTS);
    storedLists = storedLists ? JSON.parse(storedLists) : []; // Load from localStorage or default to []

    // Check if special lists are already in storedLists
    const specialListIds = SPECIAL_LISTS.map((list) => list.id);
    const hasSpecialLists = storedLists.some((list) =>
      specialListIds.includes(list.id)
    );
    if (!hasSpecialLists) {
      return [...SPECIAL_LISTS, ...storedLists]; // Add special lists to the beginning
    } else {
      // If special lists are already in storedLists, just return storedLists
      return storedLists;
    }
  });

  const [selectedList, setSelectedList] = useState(lists[0]);

  const [selectedTask, setSelectedTask] = useState(
    tasks.find((task) => task.id == selectedList.id) || tasks[0]
  );

  const [isAddMode, setIsAddMode] = useState(true);

  /* End State Variables */

  /* Begin Refs */

  const taskFormRef = useRef(null);
  const searchInputRef = useRef(null);

  /* End Refs */

  /* Begin Functions */

  const addList = (newList) => {
    setLists([...lists.slice(0, -1), newList, lists[lists.length - 1]]); // Add the new list before the last element (Uncategorized)
    setSelectedList(newList); // Select the newly added list
    resetTask(newList.id); // Reset the task view to add a new task
  };

  const deleteList = (listId) => {
    if (listId == -1 || listId == 0) return; // don't allow deleting "All Tasks" or "Uncategorized" lists

    // Deselect list if it's deleted
    if (selectedList && selectedList.id === listId) {
      changeSelectedList(lists[0]); // Select the first list in the updated lists array
      setSelectedTask(tasks[0]); // Select the first task in tasks array
    }

    // Update tasks to remove the deleted list from them
    let numUncategorizedTasks = 0;
    const updatedTasks = tasks.map((task) => {
      if (task.listId == listId) {
        numUncategorizedTasks++;
        return {
          ...task,
          listId: 0,
        };
      }
      return task;
    });

    setTasks(updatedTasks);

    changeListCount(0, numUncategorizedTasks, false); // Increment the count of the "Uncategorized" list

    setLists((prevLists) => {
      const updatedLists = prevLists.filter((list) => list.id != listId);
      return updatedLists;
    });
  };

  // Pass in a negative number to decrement the count
  const changeListCount = (
    listId,
    numListsAdded,
    changeAllTasksList = true
  ) => {
    const updatedLists = lists.map((list) => {
      if (list.id === listId || (list.id === -1 && changeAllTasksList)) {
        return {
          ...list,
          count: list.count + numListsAdded,
        };
      }
      return list;
    });
    setLists(updatedLists);
  };

  const changeSelectedList = (list) => {
    setSelectedList(list);
    if (list.count == 0) {
      resetTask(list.id);
    } else {
      setSelectedTask(
        // find first task where listId matches selected list id or if listId is 0 (which means "All Tasks"), select the first task
        tasks.find((task) => task.listId == list.id || list.id == -1)
      );
      setIsAddMode(false);
    }
  };

  const addTag = (newTag) => {
    setTags([...tags, newTag]);
  };

  const deleteTag = (tagId) => {
    // Remove the tag from all tasks that have it
    const updatedTasks = tasks.map((task) => {
      return {
        ...task,
        tagIds: task.tagIds.filter((id) => id != tagId),
      };
    });
    setTasks(updatedTasks);

    const updatedTags = tags.filter((tag) => tag.id !== tagId);
    setTags(updatedTags);
  };

  const deleteTask = (taskId) => {
    const taskListId = tasks.find((task) => task.id === taskId).listId;
    changeListCount(taskListId, -1); // Decrement the count of the list

    setTasks(tasks.filter((task) => task.id !== taskId));
    // Deselect task if it's deleted
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask(tasks.length > 0 ? tasks[0] : null);
      // TODO - make it so when a task is deleted, next one in list is selected. Above line of code can be commented out once solution below works.
      // TODO - make it so if a task is the last one in a list and it's deleted, the task is reset and user is brought to add mode on that list.
      //const taskList = lists.find((list) => list.id === taskListId);
      //const positionInList = TODO;
    }
  };

  const addTask = (newTask) => {
    if (!newTask) return; // Prevent adding empty tasks
    setTasks([...tasks, newTask]);
    changeListCount(newTask.listId, 1); // Increment the count of the list
    changeSelectedList(lists.find((list) => list.id === newTask.listId)); // Select the newly added task's list
    setIsAddMode(false);
    setSelectedTask(newTask); // Select the newly added task
  };

  const editTask = (editedTask) => {
    const formerListId = tasks.find((task) => task.id === editedTask.id).listId;
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
    if (editedTask.listId !== formerListId) {
      changeListCount(editedTask.listId, 1); // Increment the count of the new list
      changeListCount(formerListId, -1); // Decrement the count of the old list
    }
  };

  const resetTask = (newListId = selectedList.id) => {
    const newTask = {
      id: Date.now(),
      completed: false,
      title: "",
      description: "",
      // listId: 0,
      listId: newListId, // Set the listId to the currently selected list
      dueDate: "",
      tagIds: [],
    };
    setSelectedTask(newTask);
    setIsAddMode(true);
  };

  const handleStartNewTask = (e) => {
    ripple(e);
    resetTask();
    taskFormRef.current?.focusTitleInput(); // Focus the title input
  };

  const toggleCompleted = (taskId) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          return { ...task, completed: !task.completed };
        } else {
          return task;
        }
      })
    );
  };

  const getTasksByListId = (listId) => {
    if (listId == -1) {
      return tasks; // Return all tasks for "All Tasks" list
    }
    return tasks.filter((task) => task.listId === listId);
  };

  /* End Functions */

  /* Begin front-end effects */

  const ripple = (e) => {
    //const ripple = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const ripple = target.querySelector(".ripple");

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

    console.log("x", x);
    console.log("y", y);
    console.log("e.clientX", e.clientX);
    console.log("e.clientY", e.clientY);
    console.log("rect.left", rect.left);
    console.log("rect.top", rect.top);
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
    const handleKeyDown = (e) => {
      if (e.key === "/") {
        const tag = e.target.tagName.toLowerCase();
        const isEditable = e.target.isContentEditable;

        if (tag === "input" || tag === "textarea" || isEditable) {
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

  console.log("selectedList", selectedList);
  console.log("selectedTask", selectedTask);

  return (
    <div className="App">
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
      <MainView
        selectedList={selectedList}
        tasks={getTasksByListId(selectedList.id)}
        setTasks={setTasks}
        selectedTaskId={selectedTask.id}
        deleteTask={deleteTask}
        toggleCompleted={toggleCompleted}
        setSelectedTask={setSelectedTask}
        handleStartNewTask={handleStartNewTask}
        selectedTaskForDebug={selectedTask}
        setIsAddMode={setIsAddMode}
        ripple={ripple}
      />
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
    </div>
  );
};

export default App;
