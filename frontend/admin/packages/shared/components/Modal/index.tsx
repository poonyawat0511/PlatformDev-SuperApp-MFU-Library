"use client"
import React from "react";
import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions: React.ReactNode;  
}

const Modal: React.FC<ModalProps> = ({ isOpen, title, children, actions }) => {
  useEffect(() => {
    const modal = document.getElementById('global_modal') as HTMLDialogElement;
    if (isOpen) {
      modal?.showModal();
    } else {
      modal?.close();
    }
  }, [isOpen]);

  return (
    <dialog id="global_modal" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <h3 className="font-bold text-lg">{title}</h3>
        <div className="py-4">{children}</div>
        <div className="modal-action">
          {actions}
        </div>
      </div>
    </dialog>
  );
};

export default Modal;
