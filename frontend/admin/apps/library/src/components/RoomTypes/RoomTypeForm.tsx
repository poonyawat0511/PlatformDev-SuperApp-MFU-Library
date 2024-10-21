import { useState, useEffect } from "react";
import { RoomType } from "../../utils/RoomtypeTypes";
import Modal from "@shared/components/Modal";
import { LiaCheckCircle } from "react-icons/lia"; // Assuming you are using icons
import { GrFormClose } from "react-icons/gr";

interface RoomTypeFormProps {
  roomType: RoomType | null;
  onSubmit: (data: RoomType) => void;
  onClose: () => void;
}

export default function RoomTypeForm({
  roomType,
  onSubmit,
  onClose,
}: RoomTypeFormProps) {
  const [nameEn, setNameEn] = useState<string>("");
  const [nameTh, setNameTh] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (roomType) {
      setNameEn(roomType.name.en || "");
      setNameTh(roomType.name.th || "");
    } else {
      setNameEn("");
      setNameTh("");
    }
  }, [roomType]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!nameEn || !nameTh) {
      setError("Both English and Thai names are required.");
      return;
    }

    const updatedRoomType: RoomType = {
      id: roomType?.id || "", // Set id if it exists (editing case)
      name: {
        en: nameEn,
        th: nameTh,
      },
    };

    onSubmit(updatedRoomType);
  };

  return (
    <Modal
      isOpen={true}
      title={roomType ? "Edit Form" : "Create Form"}
      onClose={onClose}
      actions={
        <div className="flex justify-between">
          <button
            onClick={handleSubmit}
            className="bg-black text-white px-2 py-2 rounded-full"
          >
            <LiaCheckCircle className="size-6" />
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-2 py-2 rounded-full ml-6"
          >
            <GrFormClose className="size-6" />
          </button>
        </div>
      }
    >
      {error && <p className="text-red-500">{error}</p>}

      <div className="space-y-2">
        <label className="block text-gray-700 font-medium">Room Type Name (EN)</label>
        <input
          type="text"
          value={nameEn}
          onChange={(e) => setNameEn(e.target.value)}
          placeholder=""
          required
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-gray-700 font-medium">Room Type Name (TH)</label>
        <input
          type="text"
          value={nameTh}
          onChange={(e) => setNameTh(e.target.value)}
          placeholder=""
          required
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
        />
      </div>
    </Modal>
  );
}
