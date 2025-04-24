import { useState } from "react";

const AddListModal = ({
  lists,
  addList,
  deleteTag,
  addTaskTag,
  closeModal,
}) => {
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
      name: newListName,
      color: color,
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

        {/* <div className="lists">
          {lists.length > 0 ? (
            lists.map((list, i) => (
              <span
                key={i}
                className="list"
                style={{
                  backgroundColor: list.color,
                }}
                // TODO
                // Need to handle this a better way than having the onclick apply to the whole span because there is also the garbage icon
                onClick={(e) => {
                  e.preventDefault();
                  addTaskTag(list);
                }}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
              >
                {list.name}
                <button
                  className="delete-tag-button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation(); // prevent tag click event from firing
                    deleteTag(list);
                  }}
                >
                  <FaTrashAlt className="delete-tag-icon" />
                </button>
              </span>
            ))
          ) : (
            <p>No lists yet. Add some below!</p>
          )}
        </div> */}

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
