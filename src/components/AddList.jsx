import React from "react";
import { FaPlus } from "react-icons/fa";
import { useState } from "react";
import ListModal from "./ListModal";

const AddList = ({ lists, addList, deleteList, ripple }) => {
  const [isAddlistModalOpen, setIsAddlistModalOpen] = useState(false);
  const closeModal = () => setIsAddlistModalOpen(false);

  const openAddListModal = (e) => {
    e.preventDefault();
    ripple(e);
    setIsAddlistModalOpen(true);
  };

  return (
    <>
      <div className="add-list" onClick={openAddListModal}>
        <FaPlus className="add-list-icon" />
        <p>Add New List</p>
        <span className="ripple" />
      </div>
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
