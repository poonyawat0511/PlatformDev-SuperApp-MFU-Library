import Modal from "@shared/components/Modal";


interface ConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onClose: () => void;
  message: string;
}

export default function ConfirmDialog({
  isOpen,
  onConfirm,
  onClose,
  message,
}: ConfirmDialogProps) {
  return (
    <Modal
      isOpen={isOpen}
      title="Confirm Delete"
      onClose={onClose}
      actions={
        <div className="flex justify-between">
          <button
            onClick={onConfirm}
            className="bg-black text-white px-2 py-2 rounded-full"
          >
            Confirm
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-2 py-2 rounded-full ml-6"
          >
            Cancel
          </button>
        </div>
      }
    >
      <p>{message}</p>
    </Modal>
  );
}
