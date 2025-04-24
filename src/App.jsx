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
// Add ability to create new list
// Add ability to delete list
// Add color selector for new lists and tags

const App = () => {
  const LOCAL_STORAGE_KEY_TASKS = "todoApp.tasks";
  const LOCAL_STORAGE_KEY_TAGS = "todoApp.tags";
  const LOCAL_STORAGE_KEY_LISTS = "todoApp.lists";
  // const LOCAL_STORAGE_KEY_SETTINGS = "todoApp.settings";
  // const LOCAL_STORAGE_KEY_THEME = "todoApp.theme";

  const fakeLists = [
    { id: 1, name: "List 1", color: "blue", length: 3 },
    { id: 2, name: "List 2", color: "red", length: 6 },
  ];

  // Uncomment below line and then refresh page to reset tasks. This is helpful when the structure of tasks changes, since it can cause errors.
  // const [tasks, setTasks] = useState([]);

  const [tasks, setTasks] = useState(() => {
    const storedTasks = localStorage.getItem(LOCAL_STORAGE_KEY_TASKS);
    return storedTasks ? JSON.parse(storedTasks) : []; // Load from localStorage or default to []
  });

  const [tags, setTags] = useState(() => {
    const storedTags = localStorage.getItem(LOCAL_STORAGE_KEY_TAGS);
    return storedTags ? JSON.parse(storedTags) : []; // Load from localStorage or default to []
  });

  const [lists, setLists] = useState(() => {
    const storedLists = localStorage.getItem(LOCAL_STORAGE_KEY_LISTS);
    return storedLists ? JSON.parse(storedLists) : fakeLists; // Load from localStorage or default to fakeLists
  });

  const addList = (newList) => {
    setLists([...lists, newList]);
  };

  const deleteList = (listId) => {
    const updatedLists = lists.filter((list) => list.id !== listId);
    setLists(updatedLists);
    // Deselect list if it's deleted
    if (selectedList && selectedList.id === listId) {
      setSelectedList(updatedLists.length > 0 ? updatedLists[0] : null);
    }
  };

  const addTag = (newTag) => {
    setTags([...tags, newTag]);
  };

  const deleteTag = (tag) => {
    const updatedTags = tags.filter((t) => t !== tag);
    setTags(updatedTags);
  };

  const [selectedTask, setSelectedTask] = useState(
    tasks.length > 0 ? tasks[0] : null
  );

  const [selectedList, setSelectedList] = useState(
    lists.length > 0 ? lists[0] : null
  );

  if (tasks.length == 0) {
    const newTask = {
      id: Date.now(),
      completed: false,
      title: "Base Task so list is not empty",
      description: "This should be helpful for testing",
      list: "",
      dueDate: "",
      tags: [],
    };
    setSelectedTask(newTask);
    setTasks([newTask]);
  }

  // if (tags.length == 0) {
  //   const newTag = {
  //     color: "blue",
  //     name: "Base",
  //   };
  //   setTags([newTag]);
  // }

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
    const updatedTasks = tasks.map((task) => {
      if (task.id === editedTask.id) {
        return {
          ...task,
          title: editedTask.title,
          description: editedTask.description,
          list: editedTask.list,
          dueDate: editedTask.dueDate,
          tags: editedTask.tags,
        };
      }
      return task;
    });
    setTasks(updatedTasks);
    setSelectedTask(updatedTasks.find((task) => task.id === editedTask.id));
  };

  const resetTask = () => {
    const newTask = {
      id: Date.now(),
      completed: false,
      title: "",
      description: "",
      list: "",
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

  // const testfunction = () => {
  //   console.log("test THISSSS");
  //   setTasks(tasks.slice(0, 2));
  //   console.log(tasks.slice(0, 2));
  // };

  return (
    <div className="App">
      <Menu lists={lists} addList={addList} deleteList={deleteList} />
      <MainView
        tasks={tasks}
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
