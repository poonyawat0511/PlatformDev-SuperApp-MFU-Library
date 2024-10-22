"server client";
import { Reservation } from "@/utils/ReservationType";
import { Room } from "@/utils/RoomTypes";
import { Timeslot } from "@/utils/TimeslotType";
import { User } from "@/utils/UserTypes";
import * as Icons from "@heroicons/react/24/outline";
import Modal from "@shared/components/Modal";
import { useGlobalContext } from "@shared/context/GlobalContext";
import { tAlert, tAlertType } from "@shared/utils/types/Alert";
import React, { useEffect, useState } from "react";
import { GrFormClose } from "react-icons/gr";
import { LiaCheckCircle } from "react-icons/lia";

interface ReservationFormProps {
  reservation: Reservation | null;
  onSubmit: (formData: Reservation) => Promise<void>;
  onClose: () => void;
  rooms: Room[];
  users: User[];
  timeSlot: Timeslot[];
}

const ReservationForm: React.FC<ReservationFormProps> = ({
  reservation,
  onSubmit,
  onClose,
}) => {
  const [formData, setFormData] = useState<Reservation>({
    id: "",
    room: {
      id: "",
      room: 0,
      floor: 0,
      status: "ready",
      type: { id: "", name: { th: "", en: "" } },
    },
    user: { id: "", email: "", username: "", password: "" },
    type: "pending",
    timeSlot: { id: "", start: "", end: "" },
    dateTime: "",
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
    if (reservation) {
      setFormData(reservation);
    }
  }, [reservation]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!formData.user.username) {
      handleAddAlert(
        "ExclamationCircleIcon",
        "Username Missing",
        "Username is required",
        tAlertType.WARNING
      );
      setIsSubmitting(false);
      return;
    }

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
      const isEditing = !!reservation?.id;

      await onSubmit({
        id: isEditing ? reservation.id : undefined,
        room: formData.room.id,
        user: formData.user.username,
        type: formData.type,
        timeSlot: formData.timeSlot.id,
      } as any);

      setFormData({
        id: "",
        room: {
          id: "",
          room: 0,
          floor: 0,
          status: "ready",
          type: { id: "", name: { th: "", en: "" } },
        },
        user: { id: "", email: "", username: "", password: "" },
        type: "pending",
        timeSlot: { id: "", start: "", end: "" },
        dateTime: "",
      });
      onClose();
    } catch (error) {
      setError("Failed to submit reservation. Please check the form inputs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    if (name === "username") {
      setFormData({
        ...formData,
        user: { ...formData.user, username: value },
      });
    } else if (name === "room") {
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
        type: "pending",
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <Modal
      isOpen={true}
      title={reservation ? "Edit Form" : "Create Form"}
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
        <label className="block text-gray-700 font-medium">Username</label>
        <input
          type="text"
          name="username"
          value={formData.user.username}
          onChange={handleChange}
          placeholder="Enter username"
          required
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-gray-700 font-medium">Select Room</label>
        <select
          name="room"
          value={formData.room.id || ""}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
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
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
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
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-lg focus:ri ng focus:ring-blue-200 focus:border-blue-500"
        >
          <option value="">Select status</option>
          <option value="pending">pending</option>
          <option value="confirmed">confirmed</option>
          <option value="cancelled">cancelled</option>
        </select>
      </div>
    </Modal>
  );
};

export default ReservationForm;
