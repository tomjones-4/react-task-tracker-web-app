import React from "react";
import { FaPlus } from "react-icons/fa";
import { useState } from "react";
import ListModal from "./ListModal";

const AddList = ({ lists, addList, deleteList }) => {
  const [isAddlistModalOpen, setIsAddlistModalOpen] = useState(false);
  const closeModal = () => setIsAddlistModalOpen(false);

  const openAddListModal = (e) => {
    e.preventDefault();
    setIsAddlistModalOpen(true);
  };

  return (
    <>
      <span className="add-list" onClick={openAddListModal}>
        <FaPlus className="add-list-icon" />
        <p>Add New List</p>
      </span>
      {isAddlistModalOpen && (
        <ListModal
          lists={lists}
          addList={addList}
          deleteList={deleteList}
          closeModal={closeModal}
        />
      )}
    </>
  );
};

export default AddList;
