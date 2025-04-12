import { useState } from "react";
import { FaTrashAlt } from "react-icons/fa";

const AddTagsModal = ({ tags, addTag, deleteTag, closeModal }) => {
  const [newTag, setNewTag] = useState("");

  const handleAddTag = (e) => {
    e.preventDefault();
    addTag(newTag);
    setNewTag(""); // Clear input field after adding
  };

  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // prevent backdrop close
      >
        <button className="close-tag-modal-button" onClick={closeModal}>
          &times;
        </button>
        <h2 className="modal-title">Apply Tags</h2>

        <div className="tag-list">
          {tags.length > 0 ? (
            tags.map((tag, i) => (
              <span key={i} className="tag">
                {tag}
                <button
                  className="delete-tag-button"
                  onClick={(e) => {
                    e.preventDefault();
                    deleteTag(tag);
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
            type="text"
            placeholder="New tag name"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            className="new-tag-input"
          />
          <button className="add-tag-button" onClick={handleAddTag}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTagsModal;
