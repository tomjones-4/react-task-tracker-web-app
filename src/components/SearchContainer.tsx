import { forwardRef, useImperativeHandle, useRef } from "react";
import { FiX } from "react-icons/fi";
import { FaSearch } from "react-icons/fa";

interface SearchContainerProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

export type SearchContainerRef = {
  focusSearchInput: () => void;
};

const SearchContainer = forwardRef<SearchContainerRef, SearchContainerProps>(
  ({ searchQuery, setSearchQuery }, ref) => {
    const searchInputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => ({
      focusSearchInput() {
        searchInputRef.current?.focus();
      },
    }));

    return (
      <div className="search-container">
        <span className="search-icon">
          <FaSearch />
        </span>
        <input
          ref={searchInputRef}
          type="text"
          className="search-input"
          placeholder="Search for tasks"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        ></input>
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery("");
              searchInputRef.current?.focus();
            }}
            aria-label="Clear search"
            className="clear-search-button"
          >
            <FiX size={16} />
          </button>
        )}
      </div>
    );
  }
);

export default SearchContainer;
