import React from "react";

const AddTagsModal = ({ addTag, closeModal }) => {
  const handleAddTag = (e) => {
    addTag();
  };

  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // prevent backdrop close
      >
        <button className="close-tag-modal-btn" onClick={closeModal}>
          &times;
        </button>
        <h2 className="modal-title">Manage Tags</h2>

        <div className="tag-list">
          {/* {tags.map((tag, i) => (
            <span key={i} className="tag">
              {tag}
            </span>
          ))} */}
          {/* Example tags for demonstration */}
          <span className="tag">Work</span>
          <span className="tag">Personal</span>
          <span className="tag">Urgent</span>
          <span className="tag">Important</span>
        </div>

        <div className="new-tag-section">
          <input
            type="text"
            placeholder="New tag name"
            // value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            className="new-tag-input"
          />
          <button className="add-tag-btn" onClick={handleAddTag}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTagsModal;
