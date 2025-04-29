import { useState, useRef } from "react";
import { FaTrashAlt } from "react-icons/fa";

const AddListModal = ({ lists, addList, deleteList, closeModal }) => {
  const [newListName, setNewListName] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const getRandomPastelColor = () => {
    const hue = Math.floor(Math.random() * 360); // any hue
    return `hsl(${hue}, 70%, 85%)`; // pastel tone
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
      setError("A list with this name already exists.");
      // Auto-focus and select text
      inputRef.current.focus();
      inputRef.current.select();
      return;
    }

    let color = getRandomPastelColor();
    const newList = {
      id: Date.now(),
      name: trimmedListName,
      color: color,
      count: 0,
    };
    addList(newList);
    setNewListName(""); // Clear input field after adding
    setError(""); // Clear error message
  };

  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div
        className={`modal-content ${error ? "error" : ""}`}
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
                    deleteList(list.id);
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
          <button className="add-list-button" onClick={handleAddList}>
            Add
          </button>
        </div>
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

export default AddListModal;
