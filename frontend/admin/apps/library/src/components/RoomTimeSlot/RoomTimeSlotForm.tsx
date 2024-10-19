"server client";
import { RoomTimeSlot } from "@/utils/RoomTimeSlot";
import { Room } from "@/utils/RoomTypes";
import { Timeslot } from "@/utils/TimeslotType";
import * as Icons from "@heroicons/react/24/outline";
import Modal from "@shared/components/Modal";
import { useGlobalContext } from "@shared/context/GlobalContext";
import { tAlert, tAlertType } from "@shared/utils/types/Alert";
import React, { useEffect, useState } from "react";
import { GrFormClose } from "react-icons/gr";
import { LiaCheckCircle } from "react-icons/lia";

interface RoomTimeSlotFormProps {
  roomTimeSlot: RoomTimeSlot | null;
  onSubmit: (formData: RoomTimeSlot) => Promise<void>;
  onClose: () => void;
  rooms: Room[];
  timeSlot: Timeslot[];
}

const RoomTimeSlotForm: React.FC<RoomTimeSlotFormProps> = ({
  roomTimeSlot,
  onSubmit,
  onClose,
}) => {
  const [formData, setFormData] = useState<RoomTimeSlot>({
    room: {
      id: "",
      room: 0,
      floor: 0,
      status: "ready",
      type: { id: "", name: { th: "", en: "" } },
    },
    timeSlot: { id: "", start: "", end: "" },
    status: "free",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeslots, setTimeslots] = useState<Timeslot[]>([]);
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
    async function fetchTimeSlots() {
      try {
        const response = await fetch("http://localhost:8082/api/timeslots");
        const result = await response.json();
        console.log("Fetched timeslots:", result.data);
        setTimeslots(result.data);
      } catch (error) {
        console.error("Failed to fetch timeslots", error);
      }
    }

    fetchTimeSlots();

    async function fetchRooms() {
      try {
        const response = await fetch("http://localhost:8082/api/rooms");
        const result = await response.json();
        console.log("Fetched rooms:", result.data);
        setRooms(result.data);
      } catch (error) {
        console.error("Failed to fetch rooms", error);
      }
    }
    fetchRooms();
    fetchTimeSlots();
  }, []);

  useEffect(() => {
    if (roomTimeSlot) {
      setFormData(roomTimeSlot);
    }
  }, [roomTimeSlot]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!formData.room.id) {
      handleAddAlert(
        "ExclamationCircleIcon",
        "Room Missing",
        "Room is required",
        tAlertType.WARNING
      );
      setIsSubmitting(false);
      return;
    }

    try {
      const isEditing = !!roomTimeSlot?.id;

      await onSubmit({
        id: isEditing ? roomTimeSlot.id : undefined,
        room: formData.room.id,
        timeSlot: formData.timeSlot.id,
        status: formData.status,
      } as any);

      setFormData({
        room: {
          id: "",
          room: 0,
          floor: 0,
          status: "ready",
          type: { id: "", name: { th: "", en: "" } },
        },
        timeSlot: { id: "", start: "", end: "" },
        status: "free",
      });
      onClose();
    } catch (error) {
      setError(
        "Failed to submit room time slot. Please check the form inputs."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
  
    if (name === "room") {
      const selectedRoom = rooms.find((room) => room.id === value);
      if (selectedRoom) {
        setFormData({
          ...formData,
          room: selectedRoom,
        });
      }
    } else if (name === "timeSlot") {
      const selectedTimeSlot = timeslots.find((slot) => slot.id === value);
      if (selectedTimeSlot) {
        setFormData({
          ...formData,
          timeSlot: selectedTimeSlot,
        });
      }
    } else if (name === "status") {
      setFormData({
        ...formData,
        status: value as "free" | "in use" | "reserved", // Update the status with the selected value
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  
  
  

  return (
    <Modal
      isOpen={true}
      title={roomTimeSlot ? "Edit Form" : "Create Form"}
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
        <label className="block text-gray-700 font-medium">Select Room</label>
        <select
          name="room"
          value={formData.room.id || ""}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-full focus:ring focus:ring-blue-200 focus:border-blue-500"
        >
          <option value="" disabled>
            Select a room
          </option>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.room} - {room.type.name.en}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-gray-700 font-medium">Select Time</label>
        <select
          name="timeSlot"
          value={formData.timeSlot.id || ""}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-full focus:ring focus:ring-blue-200 focus:border-blue-500"
        >
          <option value="" disabled>
            Select a time
          </option>
          {timeslots.map((time) => (
            <option key={time.id} value={time.id}>
              {time.start} - {time.end}
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
          className="w-full p-2 border border-gray-300 rounded-full focus:ri ng focus:ring-blue-200 focus:border-blue-500"
        >
          <option value="">Select status</option>
          <option value="free">free</option>
          <option value="reserved">reserved</option>
          <option value="in use">in use</option>
        </select>
      </div>
    </Modal>
  );
};

export default RoomTimeSlotForm;
