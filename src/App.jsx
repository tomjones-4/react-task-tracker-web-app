import "./App.css";
import Menu from "./components/Menu.jsx";
import MainView from "./components/MainView.jsx";
import TaskView from "./components/TaskView.jsx";
import { useState, useEffect } from "react";

// TODO
// Add option for user to hide completed tasks instead of showing them crossed out (This could live in the settings tab)
// Make it so the list that is selected when editing a task is the list the user is currently on by default
// Make it so menu buttons show up at bottom of menu. Currently I'm setting the height of the div with menu-footer class, but there should be a better way where I can position the buttons at a certain distance from the bottom.
// Apply a highlight on selected tags in tags modal
// Don't let user add the same tag twice
// Don't let user add the same list twice
// If a tag is removed from the manage tags modal, it should be removed from tasks that have it applied? Idk, that's debateable
// Add color selector for new lists and tags
// Give user ability to see all tasks regardless of list
// Make it so ids for tasks, lists, tags, etc. are unique and incremented by 1 instead of using Date.now() (This is important for when we add the ability to edit tasks, since we need to be able to find the task in the array by id)
// Make it so list is saved correctly when it's added to task. Currently, I think it just saves the id or name, but not the other info in the list object (color, length, etc.)
// Consider using Headless UI for the modal and dropdown components. This would make it easier to style them and make them more accessible.
// Add a tag filter when "All tasks" is selected in the sidebar
// Make Uncategorized list show up at bottom of the menu lists
// Add ability to delete lists
// Have the lists show up in a different way from the tags. Also make the user confirm they want to delete a list.

const App = () => {
  /* Begin Constants */

  const LOCAL_STORAGE_KEY_TASKS = "todoApp.tasks";
  const LOCAL_STORAGE_KEY_TAGS = "todoApp.tags";
  const LOCAL_STORAGE_KEY_LISTS = "todoApp.lists";
  // const LOCAL_STORAGE_KEY_SETTINGS = "todoApp.settings";
  // const LOCAL_STORAGE_KEY_THEME = "todoApp.theme";

  const SPECIAL_LISTS = [
    { id: -1, name: "All Tasks", color: "black", count: 0 },
    { id: 0, name: "Uncategorized", color: "gray", count: 0 },
  ];

  /* End Constants */

  /* Begin State Variables */

  const [tags, setTags] = useState(() => {
    const storedTags = localStorage.getItem(LOCAL_STORAGE_KEY_TAGS);
    return storedTags ? JSON.parse(storedTags) : []; // Load from localStorage or default to []
  });

  // Uncomment below line and then refresh page to reset tasks. This is helpful when the structure of tasks changes, since it can cause errors.
  // When uncommenting this line, comment out the block below it that sets the tasks based on localStorage.
  // Same can be done with tags and lists.

  // const [tasks, setTasks] = useState([]);
  const [tasks, setTasks] = useState(() => {
    const storedTasks = localStorage.getItem(LOCAL_STORAGE_KEY_TASKS);
    return storedTasks ? JSON.parse(storedTasks) : []; // Load from localStorage or default to []
  });

  // const [lists, setLists] = useState(SPECIAL_LISTS);
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

  /* Begin Functions */

  const addList = (newList) => {
    setLists([...lists, newList]);
    setSelectedList(newList); // Select the newly added list
    resetTask(); // Reset the task view to add a new task
  };

  const deleteList = (listId) => {
    if (listId == -1 || listId == -0) return; // don't allow deleting "All Tasks" or "Uncategorized" lists

    // Deselect list if it's deleted
    if (selectedList && selectedList.id === listId) {
      changeSelectedList(lists[0]); // Select the first list in the updated lists array
      setSelectedTask(tasks[0]); // Select the first task in tasks array
    }

    console.log("Selected list after deletion:", selectedList);
    console.log("Selected task after deletion:", selectedTask);

    // Update tasks to remove the deleted list from them
    // TODO - probably need to update some logic on list count here to make sure it doesn't go negative
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

    changeListCount(0, numUncategorizedTasks); // Increment the count of the "Uncategorized" list
    setLists((prevLists) => {
      const updatedLists = prevLists.filter((list) => list.id != listId);
      return updatedLists;
    });
  };

  // Pass in a negative number to decrement the count
  const changeListCount = (listId, numListsAdded) => {
    const updatedLists = lists.map((list) => {
      if (list.id === listId || list.id == -1) {
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
      resetTask();
    } else {
      setSelectedTask(
        // find first task where listId matches selected list id or if listId is -1 (which means "All Tasks"), select the first task
        tasks.find((task) => task.listId == list.id || list.id == -1)
      );
      setIsAddMode(false);
    }
  };

  const addTag = (newTag) => {
    setTags([...tags, newTag]);
  };

  const deleteTag = (tag) => {
    const updatedTags = tags.filter((t) => t !== tag);
    setTags(updatedTags);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
    // Deselect task if it's deleted
    if (selectedTask && selectedTask.id === id) {
      setSelectedTask(tasks.length > 0 ? tasks[0] : null);
    }
  };

  const addTask = (newTask) => {
    if (!newTask) return; // Prevent adding empty tasks
    setTasks([...tasks, newTask]);
    setSelectedTask(newTask); // Select the newly added task
    changeListCount(newTask.listId, 1); // Increment the count of the list
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
          tags: editedTask.tags,
        };
      }
      return task;
    });
    setTasks(updatedTasks);
    setSelectedTask(editedTask);
    changeListCount(editedTask.listId, 1); // Increment the count of the new list
    changeListCount(formerListId, -1); // Decrement the count of the old list
  };

  const resetTask = () => {
    const newTask = {
      id: Date.now(),
      completed: false,
      title: "",
      description: "",
      listId: 0,
      dueDate: "",
      tags: "",
    };
    setSelectedTask(newTask);
    setIsAddMode(true);
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

  if (lists.length == 0) {
    const newList = {
      id: 0,
      color: "gray",
      name: "None",
      count: 0,
    };
    setSelectedList(newList);
    addList(newList);
  }

  if (tasks.length == 0) {
    const newTask = {
      id: Date.now(),
      completed: false,
      title: "Base Task so list is not empty",
      description: "This should be helpful for testing",
      listId: 0,
      dueDate: "",
      tags: [],
    };
    addTask(newTask);
    setSelectedTask(newTask);
  }

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
        selectedListName={selectedList.name}
        tasks={getTasksByListId(selectedList.id)}
        selectedTaskId={selectedTask.id}
        deleteTask={deleteTask}
        toggleCompleted={toggleCompleted}
        setSelectedTask={setSelectedTask}
        resetTask={resetTask}
        selectedTaskForDebug={selectedTask}
        setIsAddMode={setIsAddMode}
      />
      <TaskView
        selectedListId={selectedList.id}
        selectedTask={selectedTask}
        lists={lists}
        tags={tags}
        deleteTask={deleteTask}
        addTask={addTask}
        editTask={editTask}
        isAddMode={isAddMode}
        addTag={addTag}
        deleteTag={deleteTag}
      />
    </div>
  );
};

export default App;
