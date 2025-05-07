import React from "react";
import { createPortal } from "react-dom";

const modalRoot = document.getElementById("modal-root"); // usually at the end of body
if (!modalRoot) {
  throw new Error("#modal-root not found in the DOM");
}

interface ModalProps {
  closeModal: () => void;
  wiggle: boolean;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ closeModal, wiggle, children }) => {
  return createPortal(
    <div className="modal-backdrop" onClick={closeModal}>
      <div
        className={`modal-content ${wiggle ? "wiggle" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    modalRoot
  );
};

export default Modal;
