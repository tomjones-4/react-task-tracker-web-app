import React, { useState } from "react";
import { Tag } from "../types";
import Modal from "./Modal";
import TagModal from "./TagModal";

type MenuTagsProps = {
  tags: Tag[];
  addTag: (newTag: Tag) => void;
  deleteTag: (tagId: number) => void;
  selectedTagIds: number[];
  setSelectedTagIds: React.Dispatch<React.SetStateAction<number[]>>;
};

const MenuTags: React.FC<MenuTagsProps> = ({
  tags,
  addTag,
  deleteTag,
  selectedTagIds,
  setSelectedTagIds,
}) => {
  const [isTagModalOpen, setIsTagModalOpen] = useState<boolean>(false);
  const closeModal = () => setIsTagModalOpen(false);
  const [wiggle, setWiggle] = useState<boolean>(false);

  return (
    <div className="menu-tags-container">
      <h3>Tags</h3>
      <span className="tags menu-tags">
        {tags.map((tag) => (
          <span
            key={tag.id}
            className={`tag ${
              selectedTagIds.includes(tag.id) ? "selected" : ""
            }`}
            style={{ backgroundColor: tag.color, fontWeight: "bold" }}
            onClick={(e) => {
              setSelectedTagIds((prev) =>
                !selectedTagIds.includes(tag.id)
                  ? [...prev, tag.id]
                  : prev.filter((id) => id !== tag.id)
              );
            }}
          >
            {tag.name}
          </span>
        ))}
        <span
          key={0}
          className="tag"
          style={{ backgroundColor: "lightskyblue", fontWeight: "bold" }}
          onClick={(e) => {
            e.preventDefault();
            setIsTagModalOpen(true);
          }}
        >
          Add tag
        </span>
      </span>
      {isTagModalOpen && (
        <Modal closeModal={closeModal} wiggle={wiggle}>
          <TagModal
            tags={tags}
            addTag={addTag}
            deleteTag={deleteTag}
            closeModal={closeModal}
            setWiggle={setWiggle}
          />
        </Modal>
      )}
    </div>
  );
};

export default MenuTags;
