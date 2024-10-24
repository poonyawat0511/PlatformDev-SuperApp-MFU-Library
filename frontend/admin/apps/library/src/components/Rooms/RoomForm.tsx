"server client";
import { Room } from "@/utils/RoomTypes";
import { RoomType } from "@/utils/RoomtypeTypes";
import * as Icons from "@heroicons/react/24/outline";
import Modal from "@shared/components/Modal";
import { useGlobalContext } from "@shared/context/GlobalContext";
import { tAlert, tAlertType } from "@shared/utils/types/Alert";
import React, { useEffect, useState } from "react";
import { GrFormClose } from "react-icons/gr";
import { LiaCheckCircle } from "react-icons/lia";

interface RoomFormProps {
  room: Room | null;
  onSubmit: (formData: Room) => Promise<void>;
  onClose: () => void;
  roomTypes: RoomType[];
}

const RoomForm: React.FC<RoomFormProps> = ({ room, onSubmit, onClose }) => {
  const [formData, setFormData] = useState<Room>({
    id: "",
    room: 0,
    floor: 0,
    status: "ready",
    type: { id: "", name: { th: "", en: "" } },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roomTypes, setRoomTyps] = useState<RoomType[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);

  const { addAlert } = useGlobalContext();
  const handleAddAlert = (
    iconName: keyof typeof Icons,
    title: string,
    message: string,
    type: tAlertType
  ) => {
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

  useEffect(() => {
    async function fetchRoomTypes() {
      try {
        const response = await fetch("http://localhost:8082/api/room-types");
        const result = await response.json();
        console.log("Fetched room-types:", result.data);
        setRoomTyps(result.data);
      } catch (error) {
        console.error("Failed to fetch room-types", error);
      }
    }
    fetchRoomTypes();
  }, []);

  useEffect(() => {
    if (room) {
      setFormData(room);
    }
  }, [room]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!formData.room) {
      handleAddAlert(
        "ExclamationCircleIcon",
        "Room Missing",
        "Room is required",
        tAlertType.WARNING
      );
      setIsSubmitting(false);
      return;
    }

    if (!formData.floor) {
      handleAddAlert(
        "ExclamationCircleIcon",
        "Floor Missing",
        "Floor is required",
        tAlertType.WARNING
      );
      setIsSubmitting(false);
      return;
    }

    if (!formData.status) {
      handleAddAlert(
        "ExclamationCircleIcon",
        "Status Missing",
        "Status is required",
        tAlertType.WARNING
      );
      setIsSubmitting(false);
      return;
    }

    if (!formData.type.id) {
      handleAddAlert(
        "ExclamationCircleIcon",
        "Floor Missing",
        "Floor is required",
        tAlertType.WARNING
      );
      setIsSubmitting(false);
      return;
    }

    try {
      const isEditing = !!room?.id;

      await onSubmit({
        id: isEditing ? room.id : undefined,
        room: formData.room,
        floor: formData.floor,
        status: formData.status,
        type: formData.type.id,
      } as any);

      setFormData({
          id: "",
          room: 0,
          floor: 0,
          status: "ready",
          type: { id: "", name: { th: "", en: "" } },
      });
      onClose();
    } catch (error) {
      setError("Failed to submit room. Please check the form inputs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    if (name === "type") {
      const selectedType = roomTypes.find((type) => type.id === value);
      setFormData({ ...formData, type: selectedType || { id: "", name: { th: "", en: "" } } });
    } else {
      setFormData({ ...formData, [name]: name === "room" || name === "floor" ? Number(value) : value });
    }
  };

  return (
    <Modal
      isOpen={true}
      title={room ? "Edit Form" : "Create Form"}
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
        <label className="block text-gray-700 font-medium">Room</label>
        <input
          type="number"
          name="room"
          value={formData.room}
          onChange={handleChange}
          placeholder="Enter room"
          required
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-gray-700 font-medium">Floor</label>
        <input
          type="number"
          name="floor"
          value={formData.floor}
          onChange={handleChange}
          placeholder="Enter floor"
          required
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-gray-700 font-medium">Select Type</label>
        <select
          name="type"
          value={formData.type.id || ""}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
        >
          <option value="" disabled>
            Select a room
          </option>
          {roomTypes.map((roomType) => (
            <option key={roomType.id} value={roomType.id}>
              {roomType.name.en} - {roomType.name.th}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-gray-700 font-medium">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-lg focus:ri ng focus:ring-blue-200 focus:border-blue-500"
        >
          <option value="">Select status</option>
          <option value="ready">ready</option>
          <option value="not ready">not ready</option>
        </select>
      </div>
    </Modal>
  );
};

export default RoomForm;
