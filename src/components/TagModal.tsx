import React, { useState, useRef } from "react";
import ColorPickerWithPresets from "./ColorPickerWithPresets";
import { Tag } from "../types";
import { FaTrashAlt } from "react-icons/fa";

const PRESET_TAG_COLORS = [
  "#F8BBD0", // pastel pink
  "#FFDAB9", // peach
  "#FFCCB6", // pastel orange
  "#FFFACD", // light yellow
  "#C1F0C1", // mint green
  "#B2DFDB", // pastel teal
  "#B3E5FC", // powder blue
  "#E1BEE7", // lavendar
  "#D7BDE2", // mauve
  "#DCC6E0", // pastel lilac
  "#D0E1F9", // baby blue
];
interface TagModalProps {
  tags: Tag[];
  addTag: (newTag: Tag) => void;
  deleteTag: (tagId: number) => void;
  addTaskTag: (newTaskTagId: number) => void;
  taskTagIds: number[];
  closeModal: () => void;
  setWiggle: React.Dispatch<React.SetStateAction<boolean>>;
}

const TagModal: React.FC<TagModalProps> = ({
  tags,
  addTag,
  deleteTag,
  addTaskTag,
  taskTagIds,
  closeModal,
  setWiggle,
}) => {
  const [newTagName, setNewTagName] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [error, setError] = useState<string>("");

  const inputRef = useRef<HTMLInputElement>(null);

  const showError = (message: string) => {
    setError(message);
    setWiggle(true);
    setTimeout(() => setWiggle(false), 400); // Remove class after animation
    inputRef.current?.focus();
    inputRef.current?.select();
  };

  const handleAddTag = (
    e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLDivElement>
  ) => {
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
    const newTag = {
      id: Date.now(),
      name: trimmedTagName,
      color: color,
    };
    addTag(newTag);
    setNewTagName(""); // Clear input field after adding
    setError(""); // Clear error message
  };

  const handleAddTaskTag = (
    e: React.MouseEvent<HTMLSpanElement>,
    tagId: number
  ) => {
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
    <>
      <button className="close-modal-button" onClick={closeModal}>
        &times;
      </button>
      <h2 className="modal-title">Manage Tags</h2>

      <div className="tags">
        {tags.length > 0 ? (
          tags.map((tag) => (
            <span
              key={tag.id}
              className={`tag ${taskTagIds.includes(tag.id) ? "selected" : ""}`}
              style={{
                backgroundColor: tag.color,
              }}
              onClick={(e) => handleAddTaskTag(e, tag.id)}
            >
              {tag.name}
              <button
                className="trash-can-button"
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

      <div
        className="new-tag-input"
        onKeyDown={(e) => {
          if (e.key === "Enter") handleAddTag(e);
        }}
      >
        <input
          ref={inputRef}
          type="text"
          placeholder="New tag name"
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          className="tag-name-input"
        />
        <ColorPickerWithPresets
          color={color}
          setColor={(e) => setColor(e)}
          presetColors={PRESET_TAG_COLORS}
        />
      </div>
      <div className="add-tag-button">
        <button className="add-button" onClick={handleAddTag}>
          Add
        </button>
      </div>
      {error && <div className="error-message">{error}</div>}
    </>
  );
};

export default TagModal;
