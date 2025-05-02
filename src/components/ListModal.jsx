import { useState, useRef } from "react";
import { FaTrashAlt } from "react-icons/fa";

const ListModal = ({ lists, addList, deleteList, closeModal }) => {
  const getRandomPastelColor = () => {
    const hue = Math.floor(Math.random() * 360); // any hue
    return `hsl(${hue}, 70%, 85%)`; // pastel tone
  };

  const [newListName, setNewListName] = useState("");
  const [newListColor, setNewListColor] = useState(getRandomPastelColor());
  const [error, setError] = useState("");
  const [wiggle, setWiggle] = useState(false);
  const inputRef = useRef(null);
  const [listToDelete, setListToDelete] = useState(null);

  const showError = (message) => {
    setError(message);
    setWiggle(true);
    setTimeout(() => setWiggle(false), 400); // Remove class after animation
    inputRef.current.focus();
    inputRef.current.select();
  };

  const handleAddList = (e) => {
    e.preventDefault();

    const trimmedListName = newListName.trim();
    if (!trimmedListName) return; // Prevent adding empty lists

    // Check if list already exists
    if (
      lists.some(
        (list) => list.name.toLowerCase() == trimmedListName.toLowerCase()
      )
    ) {
      showError("A list with this name already exists.");
      return;
    }

    //let color = getRandomPastelColor();
    const newList = {
      id: Date.now(),
      name: trimmedListName,
      //color: color,
      color: newListColor,
      count: 0,
    };
    addList(newList);
    setNewListName(""); // Clear input field after adding
    setError(""); // Clear error message
  };

  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div
        className={`modal-content ${wiggle ? "wiggle" : ""}`}
        onClick={(e) => e.stopPropagation()} // prevent backdrop close
      >
        <button className="close-list-modal-button" onClick={closeModal}>
          &times;
        </button>
        <h2 className="modal-title">Manage Lists</h2>

        <div className="lists">
          {lists.length > 0 ? (
            lists.map((list) => (
              <span
                key={list.id}
                className="list"
                style={{
                  backgroundColor: list.color,
                }}
              >
                {list.name}
                <button
                  className="delete-tag-button"
                  onClick={(e) => {
                    e.preventDefault();
                    setListToDelete(list);
                  }}
                >
                  <FaTrashAlt className="delete-tag-icon" />
                </button>
              </span>
            ))
          ) : (
            <p>No lists yet. Add some below!</p>
          )}
        </div>

        <div className="new-list-section">
          <input
            ref={inputRef}
            type="text"
            placeholder="New list name"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            className={`new-list-input ${error ? "error" : ""}`}
          />
          <input
            type="color"
            value={newListColor}
            onChange={(e) => {
              console.log("color", newListColor);
              setNewListColor(e.target.value);
            }}
          />
          <button className="add-list-button" onClick={handleAddList}>
            Add
          </button>
        </div>
        {error && <div className="error-message">{error}</div>}
        {listToDelete && (
          // <div className="mt-4 p-4 bg-red-50 border border-red-300 rounded-lg animate-slide-up">
          <div className="delete-list">
            <h3 className="title">Delete list "{listToDelete.name}"?</h3>
            <p className="message">
              Tasks in this list will be preserved and moved to the{" "}
              <strong>Uncategorized</strong> list.
            </p>
            <div className="actions">
              <button
                onClick={() => setListToDelete(null)}
                className="cancel-button"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteList(listToDelete.id);
                  setListToDelete(null);
                }}
                className="delete-button"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListModal;
