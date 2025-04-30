import "./App.css";
import Menu from "./components/Menu.jsx";
import MainView from "./components/MainView.jsx";
import TaskView from "./components/TaskView.jsx";
import { useState, useEffect, useRef } from "react";

// TODO

/* High Priority */
// Need to handle the case where there is no selected task. Right now the code assumes there will always be a selected task, which causes errors if there are no tasks.
// Don't allow adding empty tasks
/* End High Priority */

/* Medium Priority */
// Add option for user to hide completed tasks instead of showing them crossed out (This could live in the settings tab)
// Make it so ids for tasks, lists, tags, etc. are unique and incremented by 1 instead of using Date.now() (This is important for when we add the ability to edit tasks, since we need to be able to find the task in the array by id.) THIS REQUIRES SUPABASE INTEGRATION - this will be a big one
// Add a tag filter when "All tasks" is selected in the sidebar
// Allow tasks to have subtasks. (See the mockup on Github)
/* End Medium Priority */

/* Low Priority */
// Allow users to drag and drop tasks to reorder them.
// Need to figure out what expected behavior should be when tags are removed. Currently the tag ids still live on the task, but they don't show up. I think tags should behave similarly to lists, and when a tag is removed, it should be removed from all tasks that have it.
// Have the lists show up in a different way from the tags.
// Refactor whatever logic is shared between lists and tags modals
// Make it so menu buttons show up at bottom of menu. Currently I'm setting the height of the div with menu-footer class, but there should be a better way where I can position the buttons at a certain distance from the bottom.
// Consider using Headless UI for the modal and dropdown components. This would make it easier to style them and make them more accessible.
// Improve the UX when a user adds tons of tags. Currently it overflows and looks ugly.
// Improve the UX for color picker.
// Improve the adding/editing task form UI.
// Use highlights to show tasks that are getting old or are due urgently.
// Have the menu slide stay in a fixed position even as user scrolls down on list.
// Persistent scroll position per list - If you scroll down a list of tasks, then switch to another and come back, restore your scroll.
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
    }
  };

  const addTask = (newTask) => {
    if (!newTask) return; // Prevent adding empty tasks
    setTasks([...tasks, newTask]);
    changeListCount(newTask.listId, 1); // Increment the count of the list
    changeSelectedList(lists.find((list) => list.id === newTask.listId)); // Select the newly added task's list
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

  const handleStartNewTask = () => {
    resetTask();
    taskFormRef.current?.focusTitleInput(); // Focus the title input
  };

  const toggleCompleted = (id) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
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
        addList={addList}
        deleteList={deleteList}
        changeSelectedList={changeSelectedList}
        selectedListId={selectedList.id}
      />
      <MainView
        selectedList={selectedList}
        tasks={getTasksByListId(selectedList.id)}
        selectedTaskId={selectedTask.id}
        deleteTask={deleteTask}
        toggleCompleted={toggleCompleted}
        setSelectedTask={setSelectedTask}
        handleStartNewTask={handleStartNewTask}
        selectedTaskForDebug={selectedTask}
        setIsAddMode={setIsAddMode}
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
        taskFormRef={taskFormRef}
      />
    </div>
  );
};

export default App;
