"use client";

import ConfirmDialog from "@/components/Rooms/ConfirmDialog";
import RoomForm from "@/components/Rooms/RoomForm";
import RoomTable from "@/components/Rooms/RoomTable";
import { Room } from "@/utils/RoomTypes";
import { RoomType } from "@/utils/RoomtypeTypes";
import * as Icons from "@heroicons/react/24/outline";
import { useGlobalContext } from "@shared/context/GlobalContext";
import { tAlert, tAlertType } from "@shared/utils/types/Alert";
import { useEffect, useState } from "react";

const apiUrl = `http://localhost:8082/api/rooms`;
const apiRoomTypeUrl = `http://localhost:8082/api/room-types`;


async function fetchRooms(): Promise<Room[]> {
  try {
    const response = await fetch(apiUrl);
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

async function fetchRoomTypes(): Promise<RoomType[]> {
  try {
    const response = await fetch(apiRoomTypeUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch room-type");
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [roomIdToDelete, setRoomIdToDelete] = useState<string | null>(null);
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
      const fetchedRooms = await fetchRooms();
      const fetchedRoomTypes = await fetchRoomTypes();
      setRooms(fetchedRooms);
      setRoomTypes(fetchedRoomTypes);
    };

    fetchData();
  }, []);

  const handleCreate = () => {
    setEditingRoom(null);
    setIsFormOpen(true);
  };

  const handleEdit = (room: Room) => {
    setEditingRoom(room);
    setIsFormOpen(true);
  };

  const confirmDelete = (roomId: string) => {
    setRoomIdToDelete(roomId);
    setIsConfirmDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!roomIdToDelete) return;

    try {
      const response = await fetch(`${apiUrl}/${roomIdToDelete}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete room");
      }
      setRooms(
        rooms.filter((t) => t.id !== roomIdToDelete)
      );
      handleAddAlert(
        "ExclamationCircleIcon",
        "Success",
        "Room deleted successfully",
        tAlertType.SUCCESS
      );
    } catch (error) {
      console.log(error);
    } finally {
      setIsConfirmDialogOpen(false);
      setRoomIdToDelete(null);
    }
  };

  const handleFormSubmit = async (formData: Room) => {
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
          `Failed to ${method === "POST" ? "create" : "update"} room`
        );
      }

      const result = await response.json();
      if (method === "POST") {
        setRooms([...rooms, result.data]);
      } else {
        setRooms(
          rooms.map((t) => (t.id === result.data.id ? result.data : t))
        );
      }
      setIsFormOpen(false);
      handleAddAlert(
        "ExclamationCircleIcon",
        "Success",
        "Room updated successfully",
        tAlertType.SUCCESS
      );
      setSelectedRoom(null);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="min-h-screen p-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-4 px-4 border-b-2">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Room</h1>
          <button
            onClick={handleCreate}
            className="bg-black text-white px-4 py-2 rounded-full shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-white mb-6"
          >
            New Room
          </button>
        </div>

        {isFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
              <RoomForm
                room={selectedRoom}
                onSubmit={handleFormSubmit}
                onClose={() => setIsFormOpen(false)}
                roomTypes={roomTypes}
              />
            </div>
          </div>
        )}

        <div className="flex flex-wrap justify-start">
          <RoomTable
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
        message="Are you sure you want to delete this transaction?"
      />
    </div>
  );
}
