import { useState, useRef } from "react";
import { FaTrashAlt } from "react-icons/fa";

const AddTagsModal = ({
  tags,
  addTag,
  deleteTag,
  addTaskTag,
  taskTagIds,
  closeModal,
}) => {
  const [newTagName, setNewTagName] = useState("");
  const [error, setError] = useState("");
  const [wiggle, setWiggle] = useState(false);
  const inputRef = useRef(null);

  const showError = (message) => {
    setError(message);
    setWiggle(true);
    setTimeout(() => setWiggle(false), 400); // Remove class after animation
    inputRef.current.focus();
    inputRef.current.select();
  };

  const getRandomPastelColor = () => {
    const hue = Math.floor(Math.random() * 360); // any hue
    return `hsl(${hue}, 70%, 85%)`; // pastel tone
  };

  const handleAddTag = (e) => {
    e.preventDefault();

    const trimmedTagName = newTagName.trim();
    if (!trimmedTagName) return; // Prevent adding empty tags

    // Check if tag already exists
    if (
      tags.some((tag) => tag.name.toLowerCase() == trimmedTagName.toLowerCase())
    ) {
      showError("A tag with this name already exists.");

      return;
    }

    let color = getRandomPastelColor();
    const newTag = {
      id: Date.now(),
      name: trimmedTagName,
      color: color,
    };
    addTag(newTag);
    setNewTagName(""); // Clear input field after adding
    setError(""); // Clear error message
  };

  const handleAddTaskTag = (e, tagId) => {
    e.preventDefault();
    // Check if tag is already applied
    if (taskTagIds.some((id) => id === tagId)) {
      showError("This tag is already applied.");
      return;
    }
    addTaskTag(tagId);
    setError(""); // Clear error message
  };

  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div
        className={`modal-content ${error ? "error" : ""} ${
          wiggle ? "wiggle" : ""
        }`}
        onClick={(e) => e.stopPropagation()} // prevent backdrop close
      >
        <button className="close-tag-modal-button" onClick={closeModal}>
          &times;
        </button>
        <h2 className="modal-title">Manage Tags</h2>

        <div className="tags">
          {tags.length > 0 ? (
            tags.map((tag) => (
              <span
                key={tag.id}
                className={`tag ${
                  taskTagIds.includes(tag.id) ? "selected" : ""
                }`}
                style={{
                  backgroundColor: tag.color,
                }}
                onClick={(e) => handleAddTaskTag(e, tag.id)}
              >
                {tag.name}
                <button
                  className="delete-tag-button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation(); // prevent tag click event from firing
                    deleteTag(tag.id);
                  }}
                >
                  <FaTrashAlt className="delete-tag-icon" />
                </button>
              </span>
            ))
          ) : (
            <p>No tags yet. Add some below!</p>
          )}
        </div>

        <div className="new-tag-section">
          <input
            ref={inputRef}
            type="text"
            placeholder="New tag name"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            className={`new-tag-input ${error ? "error" : ""}`}
          />
          <button className="add-tag-button" onClick={handleAddTag}>
            Add
          </button>
        </div>
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

export default AddTagsModal;
