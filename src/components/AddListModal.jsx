import { useState } from "react";
import { FaTrashAlt } from "react-icons/fa";

const AddListModal = ({ lists, addList, deleteList, closeModal }) => {
  const [newListName, setNewListName] = useState("");

  const getRandomPastelColor = () => {
    const hue = Math.floor(Math.random() * 360); // any hue
    return `hsl(${hue}, 70%, 85%)`; // pastel tone
  };

  const handleAddList = (e) => {
    e.preventDefault();
    if (!newListName.trim()) return; // Prevent adding empty lists
    let color = getRandomPastelColor();
    const newList = {
      id: Date.now(),
      name: newListName,
      color: color,
      count: 0,
    };
    addList(newList);
    setNewListName(""); // Clear input field after adding
  };

  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div
        className="modal-content"
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
            type="text"
            placeholder="New list name"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            className="new-list-input"
          />
          <button className="add-list-button" onClick={handleAddList}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddListModal;
