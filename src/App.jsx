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
// If a tag is removed from the manage tags modal, it should be removed from tasks that have it applied? Idk, that's debateable
// Add ability to delete list
// Add color selector for new lists and tags
// Give user ability to see all tasks regardless of list
// Make it so ids for tasks, lists, tags, etc. are unique and incremented by 1 instead of using Date.now() (This is important for when we add the ability to edit tasks, since we need to be able to find the task in the array by id)
// Make it so list is saved correctly when it's added to task. Currently, I think it just saves the id or name, but not the other info in the list object (color, length, etc.)
// Consider using Headless UI for the modal and dropdown components. This would make it easier to style them and make them more accessible.
// Highlight the selected list item in the sidebar (background color or bold text)
// Add a tag filter when "All tasks" is selected in the sidebar

const App = () => {
  const LOCAL_STORAGE_KEY_TASKS = "todoApp.tasks";
  const LOCAL_STORAGE_KEY_TAGS = "todoApp.tags";
  const LOCAL_STORAGE_KEY_LISTS = "todoApp.lists";
  // const LOCAL_STORAGE_KEY_SETTINGS = "todoApp.settings";
  // const LOCAL_STORAGE_KEY_THEME = "todoApp.theme";

  // Uncomment below line and then refresh page to reset tasks. This is helpful when the structure of tasks changes, since it can cause errors.
  // Same can be done with tags and lists.
  // When uncommenting this line, comment out the one below it that sets the tasks based on localStorage.
  // const [tasks, setTasks] = useState([]);

  const specialLists = [
    { id: -1, name: "All Tasks", color: "black", count: 0 },
    { id: 0, name: "Uncategorized", color: "gray", count: 0 },
  ];

  const [tags, setTags] = useState(() => {
    const storedTags = localStorage.getItem(LOCAL_STORAGE_KEY_TAGS);
    return storedTags ? JSON.parse(storedTags) : []; // Load from localStorage or default to []
  });

  // const [lists, setLists] = useState(specialLists);

  // Need to change this so that special lists aren't multiply added every time the page is refreshed
  const [lists, setLists] = useState(() => {
    let storedLists = localStorage.getItem(LOCAL_STORAGE_KEY_LISTS);
    storedLists = storedLists ? JSON.parse(storedLists) : []; // Load from localStorage or default to []

    // Check if special lists are already in storedLists
    const specialListIds = specialLists.map((list) => list.id);
    const hasSpecialLists = storedLists.some((list) =>
      specialListIds.includes(list.id)
    );
    if (!hasSpecialLists) {
      return [...specialLists, ...storedLists]; // Add special lists to the beginning
    } else {
      // If special lists are already in storedLists, just return storedLists
      return storedLists;
    }
  });

  const [selectedList, setSelectedList] = useState(lists[0]);

  const addList = (newList) => {
    setLists([...lists, newList]);
  };

  const deleteList = (listId) => {
    if (listId == -1 || listId == -0) return; // don't allow deleting "All Tasks" or "Uncategorized" lists
    const updatedLists = lists.filter((list) => list.id !== listId);
    setLists(updatedLists);
    // Deselect list if it's deleted
    if (selectedList && selectedList.id === listId) {
      setSelectedList(updatedLists.length > 0 ? updatedLists[0] : null);
    }
    // Update tasks to remove the deleted list from them
    // TODO - probably need to update some logic on list count here to make sure it doesn't go negative
    const updatedTasks = tasks.map((task) => {
      if (task.listId === listId) {
        return {
          ...task,
          listId: 0,
        };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const changeSelectedList = (list) => {
    setSelectedList(list);
    setSelectedTask(tasks.find((task) => task.listId == list.id) || tasks[0]);
  };

  const addTag = (newTag) => {
    setTags([...tags, newTag]);
  };

  const deleteTag = (tag) => {
    const updatedTags = tags.filter((t) => t !== tag);
    setTags(updatedTags);
  };

  const [tasks, setTasks] = useState(() => {
    const storedTasks = localStorage.getItem(LOCAL_STORAGE_KEY_TASKS);
    return storedTasks ? JSON.parse(storedTasks) : []; // Load from localStorage or default to []
  });

  const [selectedTask, setSelectedTask] = useState(
    tasks.find((task) => task.id == selectedList.id) || tasks[0]
  );

  if (lists.length == 0) {
    const newList = {
      id: 0,
      color: "gray",
      name: "None",
      count: 0,
    };
    setSelectedList(newList);
    setLists([newList]);
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
    setSelectedTask(newTask);
    setTasks([newTask]);
  }
  const [isAddMode, setIsAddMode] = useState(true);

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

    const updatedLists = lists.map((list) => {
      if (list.id === editedTask.listId) {
        return {
          ...list,
          count: list.count + 1,
        };
      } else if (list.id === formerListId) {
        return {
          ...list,
          count: list.count - 1,
        };
      }
      return list;
    });
    setLists(updatedLists);
    setSelectedTask(editedTask);
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

  // const testfunction = () => {
  //   console.log("test THISSSS");
  //   setTasks(tasks.slice(0, 2));
  //   console.log(tasks.slice(0, 2));
  // };

  return (
    <div className="App">
      <Menu
        lists={lists}
        addList={addList}
        deleteList={deleteList}
        changeSelectedList={changeSelectedList}
      />
      <MainView
        selectedListName={selectedList.name}
        tasks={getTasksByListId(selectedList.id)}
        deleteTask={deleteTask}
        toggleCompleted={toggleCompleted}
        setSelectedTask={setSelectedTask}
        resetTask={resetTask}
        selectedTaskForDebug={selectedTask}
        setIsAddMode={setIsAddMode}
      />
      <TaskView
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
