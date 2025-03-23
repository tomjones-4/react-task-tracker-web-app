import logo from "./logo.svg";
import "./App.css";
import TodoList from "./components/TodoList.jsx";
import AddTodo from "./components/AddTodo.jsx";

function App() {
  return (
    <div className="App">
      <TodoList />
      <AddTodo />
    </div>
  );
}

export default App;
