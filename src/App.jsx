import logo from "./logo.svg";
import "./App.css";
import Menu from "./components/Menu.jsx";
import MainView from "./components/MainView.jsx";
import TaskView from "./components/TaskView.jsx";

function App() {
  return (
    <div className="App">
      <Menu />
      <MainView />
      <TaskView />
    </div>
  );
}

export default App;
