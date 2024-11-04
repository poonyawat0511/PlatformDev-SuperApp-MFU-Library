"use client";
import ConfirmDialog from "@/components/RoomTimeSlot/ConfirmDialog";
import RoomTimeSlotForm from "@/components/RoomTimeSlot/RoomTimeSlotForm";
import RoomTimeSlotTable from "@/components/RoomTimeSlot/RoomTimeSlotTable";
import { RoomTimeSlot } from "@/utils/RoomTimeSlot";
import { Room } from "@/utils/RoomTypes";
import { Timeslot } from "@/utils/TimeslotType";
import * as Icons from "@heroicons/react/24/outline";
import { useGlobalContext } from "@shared/context/GlobalContext";
import { tAlert, tAlertType } from "@shared/utils/types/Alert";
import { useEffect, useState } from "react";

const apiUrl = `http://localhost:8082/api/room-timeslots`;
const timeSlotapiUrl = `http://localhost:8082/api/timeslots`;
const apiRoomUrl = `http://localhost:8082/api/rooms`;

async function fetchRoomTimeSlots(): Promise<RoomTimeSlot[]> {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch Room-Time-Slot");
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function fetchRooms(): Promise<Room[]> {
  try {
    const response = await fetch(apiRoomUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch rooms");
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function fetchTimeSlots(): Promise<Timeslot[]> {
  try {
    const response = await fetch(timeSlotapiUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch Time-Slot");
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export default function RoomTimeSlotPage() {
  const [roomTimeSlots, setRoomTimeSlots] = useState<RoomTimeSlot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRoomTimeSlot, setSelectedRoomTimeSlot] =
    useState<RoomTimeSlot | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [timeSlots, setTimeSlots] = useState<Timeslot[]>([]);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [roomTimeSlotIdToDelete, setRoomTimeSlotIdToDelete] = useState<
    string | null
  >(null);
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
    const fetchData = async () => {
      const fetchedReservations = await fetchRoomTimeSlots();
      const fetchedRooms = await fetchRooms();
      const fetchedTimeslots = await fetchTimeSlots();
      setRoomTimeSlots(fetchedReservations);
      setRooms(fetchedRooms);
      setTimeSlots(fetchedTimeslots);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleCreate = () => {
    setSelectedRoomTimeSlot(null);
    setIsFormOpen(true);
  };

  const handleEdit = (roomTimeSlots: RoomTimeSlot) => {
    setSelectedRoomTimeSlot(roomTimeSlots);
    setIsFormOpen(true);
  };

  const confirmDelete = (roomTimeSlotsId: string) => {
    setRoomTimeSlotIdToDelete(roomTimeSlotsId);
    setIsConfirmDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!roomTimeSlotIdToDelete) return;

    try {
      const response = await fetch(`${apiUrl}/${roomTimeSlotIdToDelete}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete room time slot");
      }
      setRoomTimeSlots(
        roomTimeSlots.filter((t) => t.id !== roomTimeSlotIdToDelete)
      );
      handleAddAlert(
        "ExclamationCircleIcon",
        "Success",
        "Room time slot deleted successfully",
        tAlertType.SUCCESS
      );
    } catch (error) {
      console.log(error);
    } finally {
      setIsConfirmDialogOpen(false);
      setRoomTimeSlotIdToDelete(null);
    }
  };

  const handleFormSubmit = async (formData: RoomTimeSlot) => {
    try {
      const method = formData.id ? "PATCH" : "POST";
      const url = apiUrl + (formData.id ? `/${formData.id}` : "");

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to ${method === "POST" ? "create" : "update"} Room time slot`
        );
      }

      const result = await response.json();
      if (method === "POST") {
        setRoomTimeSlots([...roomTimeSlots, result.data]);
      } else {
        setRoomTimeSlots(
          roomTimeSlots.map((t) => (t.id === result.data.id ? result.data : t))
        );
      }
      setIsFormOpen(false);
      handleAddAlert(
        "ExclamationCircleIcon",
        "Success",
        "Room time slot updated successfully",
        tAlertType.SUCCESS
      );
      setSelectedRoomTimeSlot(null);
    } catch (error) {
      console.log(error);
    }
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen p-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-4 px-4 border-b-2">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            Room time slot
          </h1>
          <button
            onClick={handleCreate}
            className="bg-black text-white px-4 py-2 rounded-full shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-white mb-6"
          >
            New Room-time-slot
          </button>
        </div>

        {isFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
              <RoomTimeSlotForm
                roomTimeSlot={selectedRoomTimeSlot}
                onSubmit={handleFormSubmit}
                onClose={() => setIsFormOpen(false)}
                rooms={rooms}
                timeSlot={timeSlots}
              />
            </div>
          </div>
        )}

        <div className="flex flex-wrap justify-start">
          <RoomTimeSlotTable
            roomTimeSlots={roomTimeSlots}
            timeSlots={timeSlots}
            rooms={rooms}
            onEdit={handleEdit}
            onDelete={confirmDelete}
          />
        </div>
      </div>
      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onConfirm={handleDelete}
        onClose={() => setIsConfirmDialogOpen(false)}
        message="Are you sure you want to delete this room time slot?"
      />
    </div>
  );
}
