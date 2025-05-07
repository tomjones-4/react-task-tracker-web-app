import React, { useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { useState } from "react";
import ListModal from "./ListModal";
import Modal from "./Modal";
import { List } from "../types";

type AddListProps = {
  lists: List[];
  addList: (newList: List) => void;
  deleteList: (listId: number) => void;
  ripple: (e: React.MouseEvent<HTMLDivElement>) => void;
};

const AddList: React.FC<AddListProps> = ({
  lists,
  addList,
  deleteList,
  ripple,
}) => {
  const [wiggle, setWiggle] = useState<boolean>(false);
  const [isAddlistModalOpen, setIsAddlistModalOpen] = useState<boolean>(false);
  const closeModal = () => setIsAddlistModalOpen(false);

  const openAddListModal = (e: React.MouseEvent<HTMLDivElement>) => {
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
        <Modal closeModal={closeModal} wiggle={wiggle}>
          <ListModal
            lists={lists}
            addList={addList}
            deleteList={deleteList}
            closeModal={closeModal}
            setWiggle={setWiggle}
          />
        </Modal>
      )}
    </>
  );
};

export default AddList;
