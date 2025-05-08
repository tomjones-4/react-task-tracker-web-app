import { useState, useRef } from "react";
import { List } from "../types";
import { FaTrashAlt } from "react-icons/fa";
import ColorPickerWithPresets from "./ColorPickerWithPresets";

const PRESET_LIST_COLORS = [
  "#FF4C4C", // bright red
  "#FF9900", // orange
  "#FFD700", // golden yellow
  "#66DD00", // lime green
  "#00CC66", // emerald green
  "#00CFCF", // aqua / teal
  "#3399FF", // sky blue
  "#3366FF", // royal blue
  "#9966FF", // violet
  "#FF33CC", // magenta
  "#FF3399", // hot pink
];

interface ListModalProps {
  lists: List[];
  addList: (newList: List) => void;
  deleteList: (listId: number) => void;
  closeModal: () => void;
  setWiggle: React.Dispatch<React.SetStateAction<boolean>>;
}

const ListModal: React.FC<ListModalProps> = ({
  lists,
  addList,
  deleteList,
  closeModal,
  setWiggle,
}) => {
  const [newListName, setNewListName] = useState<string>("");
  const [color, setColor] = useState<string>("");

  type infoMessage = {
    list: string;
    message: string;
  };

  const [info, setInfo] = useState<infoMessage>({
    list: "",
    message: "",
  });
  const [error, setError] = useState<string>("");
  const [listToDelete, setListToDelete] = useState<List | undefined>();

  const inputRef = useRef<HTMLInputElement>(null);

  const showError = (message: string) => {
    setError(message);
    setWiggle(true);
    setTimeout(() => setWiggle(false), 400); // Remove class after animation
    inputRef.current?.focus();
    inputRef.current?.select();
  };

  const handleAddList = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setListToDelete(undefined);
    setInfo({ list: "", message: "" });

    const trimmedListName = newListName.trim();
    if (!trimmedListName) return; // Prevent adding empty lists

    // Check if list already exists
    if (
      lists.some(
        (list) => list.name.toLowerCase() == trimmedListName.toLowerCase()
      )
    ) {
      showError("A list with this name already exists: ");
      return;
    }

    const newList: List = {
      id: Date.now(),
      name: trimmedListName,
      //color: color,
      color: color,
      taskIds: [],
    };
    addList(newList);
    setNewListName(""); // Clear input field after adding
    setError(""); // Clear error message
  };

  return (
    <>
      <button className="close-modal-button" onClick={closeModal}>
        &times;
      </button>
      <h2 className="modal-title">Manage Lists</h2>

      <div className="lists">
        {lists.length > 0 ? (
          lists.slice(1).map((list) => (
            <span
              key={list.id}
              className="list"
              style={{
                backgroundColor: list.color,
              }}
            >
              {list.name}
              <button
                className="trash-can-button"
                onClick={(e) => {
                  e.preventDefault();
                  if (list.id === -1 || list.id === 0) {
                    setListToDelete(undefined);
                    setError("");
                    setInfo({
                      list: list.name,
                      message: "list cannot be deleted.",
                    });
                  } else {
                    setInfo({ list: "", message: "" });
                    setListToDelete(list);
                  }
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

      <div className="new-list-input">
        <input
          ref={inputRef}
          className={`list-name-input ${error ? "error" : ""}`}
          type="text"
          placeholder="New list name"
          value={newListName}
          onChange={(e) => {
            setNewListName(e.target.value);
            setError("");
          }}
        />
        <ColorPickerWithPresets
          color={color}
          setColor={(e) => setColor(e)}
          presetColors={PRESET_LIST_COLORS}
        />
      </div>
      <div className="add-list-button">
        <button className="add-button" onClick={handleAddList}>
          Add
        </button>
      </div>

      {info.message && (
        <div className="info-message" role="alert">
          <svg
            className="info-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 
       10-4.477 10-10S17.523 2 12 2zm0 3a1.25 1.25 0 1 1 0 2.5 
       1.25 1.25 0 0 1 0-2.5zm1 14h-2v-2h2v2zm0-4h-2V9h2v6z"
            />
          </svg>
          <span className="info-text">
            <p>
              <strong>{info.list}</strong> {info.message}
            </p>
          </span>
          <button
            className="info dismiss"
            aria-label="Dismiss message"
            onClick={() => setInfo({ list: "", message: "" })}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="dismiss-icon"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      )}

      {error && (
        <div className="error-message" role="alert">
          <span className="error-text">
            <p>
              {error} <strong>{newListName}</strong>
            </p>
          </span>
          <button
            className="error dismiss"
            aria-label="Dismiss message"
            onClick={() => setError("")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="dismiss-icon"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      )}

      {listToDelete && (
        <div className="error-message delete-list">
          <h3 className="title">Delete list "{listToDelete.name}"?</h3>
          <p className="message">
            Tasks in this list will be preserved and moved to the{" "}
            <strong>Uncategorized</strong> list.
          </p>
          <div className="actions">
            <button
              onClick={() => {
                setListToDelete(undefined);
                setError("");
              }}
              className="cancel-button"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                deleteList(listToDelete.id);
                setListToDelete(undefined);
                setError("");
              }}
              className="delete-button"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ListModal;
