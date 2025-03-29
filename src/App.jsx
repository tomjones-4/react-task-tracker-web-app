import logo from "./logo.svg";
import "./App.css";
import TodoList from "./components/TodoList.jsx";
import Menu from "./components/Menu.jsx";

function App() {
  return (
    <div className="App">
      <Menu />
      <TodoList />
    </div>
  );
}

export default App;
