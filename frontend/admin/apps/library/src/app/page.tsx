"use client";
import { useState } from "react";
import * as Icons from '@heroicons/react/24/outline';
import { useGlobalContext } from "@shared/context/GlobalContext";
import { tAlert, tAlertType } from "@shared/utils/types/Alert";
import Modal from "@shared/components/Modal";
import Button from "@shared/components/Button/index";

export default function Home() {
  const { addAlert } = useGlobalContext();
  const handleAddAlert = (iconName: keyof typeof Icons, title: string, message: string, type: tAlertType) => {
    const newAlert: tAlert = {
      title: title,
      message: message,
      buttonText: "X",
      iconName: iconName,
      type: type,
      id: Math.random().toString(36).substring(2, 9),
    };
    addAlert(newAlert);
  };
  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);
  return (
    <main className="flex items-start justify-items-start gap-4">
      {/* Alert Example */}
      <div className="flex flex-col items-center gap-2 border-dashed border-2 rounded p-4">
        <h1>Alert</h1>
        <button className="btn w-full" onClick={() => handleAddAlert("CheckIcon","Success", "Example MessageExample MessageExample MessageExample MessageExample MessageExample MessageExample Message", tAlertType.SUCCESS)}>Success Alert</button>
        <button className="btn w-full" onClick={() => handleAddAlert("InformationCircleIcon","Warning", "Example Message", tAlertType.WARNING)}>Warning Alert</button>
        <button className="btn w-full" onClick={() => handleAddAlert("XCircleIcon", "Example Message","Error", tAlertType.ERROR)}>Error Alert</button>
      </div>

      {/* Modal Example */}
      <div className="flex flex-col items-center gap-2 border-dashed border-2 rounded p-4">
        <h1>Modal</h1>
        <div>
          <button className="btn" onClick={handleOpenModal}>
            Open Modal
          </button>
          <Modal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            title="Hello!"
            actions={
              <>
                <Button label={"Submit"} onClick={handleCloseModal}></Button>
                <Button label={"Close"} onClick={handleCloseModal}></Button>
              </>
            }
          >
            <p>click the button below to close</p>
          </Modal>
        </div>
      </div>
          
      
    </main>
  );
}
