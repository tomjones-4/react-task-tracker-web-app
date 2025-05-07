import { useState, useRef } from "react";
import { List } from "../types";
import { FaTrashAlt } from "react-icons/fa";
import ColorPickerWithPresets from "./ColorPickerWithPresets";

type ListModalProps = {
  lists: List[];
  addList: (newList: List) => void;
  deleteList: (listId: number) => void;
  closeModal: () => void;
};

const getRandomPastelColor = () => {
  const hue = Math.floor(Math.random() * 360); // any hue
  return `hsl(${hue}, 70%, 85%)`; // pastel tone
};

const ListModal: React.FC<ListModalProps> = ({
  lists,
  addList,
  deleteList,
  closeModal,
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
  const [wiggle, setWiggle] = useState<boolean>(false);
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

    //let color = getRandomPastelColor();
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
            type="text"
            placeholder="New list name"
            value={newListName}
            onChange={(e) => {
              setNewListName(e.target.value);
              setError("");
            }}
            className={`list-name-input ${error ? "error" : ""}`}
          />
          <ColorPickerWithPresets color={color} onChange={(e) => setColor(e)} />
        </div>
        <div className="new-list-button">
          <button
            className="add-button"
            onClick={(e) => {
              setInfo({ list: "", message: "" });
              console.log("color", color);
              handleAddList(e);
            }}
          >
            Add
          </button>
          <button onClick={() => console.log(getRandomPastelColor())}>
            Color generator
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
          // <div className="mt-4 p-4 bg-red-50 border border-red-300 rounded-lg animate-slide-up">
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
      </div>
    </div>
  );
};

export default ListModal;
