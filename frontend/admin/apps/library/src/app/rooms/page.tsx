"use client";

import { useEffect, useState } from "react";
import { Room } from "@/utils/RoomTypes";
import RoomTable from "@/components/Rooms/RoomTable";
import RoomForm from "@/components/Rooms/RoomCard";
import ConfirmDialog from "@/components/Rooms/ConfirmDialog";

const apiUrl = `http://localhost:8082/api/rooms`;

async function fetchRooms(): Promise<Room[]> {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch rooms");
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null); // for handling confirmation modal

  useEffect(() => {
    fetchRooms().then((data) => {
      setRooms(data);
      setLoading(false);
    });
  }, []);

  const handleCreate = () => {
    setEditingRoom(null);
    setIsFormOpen(true);
  };

  const handleEdit = (room: Room) => {
    setEditingRoom(room);
    setIsFormOpen(true);
  };

  const handleDelete = async (roomId: string) => {
    try {
      const response = await fetch(`${apiUrl}/${roomId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete room");
      }
      setRooms(rooms.filter((room) => room.id !== roomId));
    } catch (error) {
      console.error("Failed to delete room:", error);
    }
  };

  const handleFormSubmit = async (data: Room) => {
    try {
      const isUpdate = !!data.id;
      const method = isUpdate ? "PATCH" : "POST";
      const url = isUpdate ? `${apiUrl}/${data.id}` : apiUrl;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        if (isUpdate) {
          setRooms(rooms.map((r) => (r.id === result.data.id ? result.data : r)));
        } else {
          setRooms([...rooms, result.data]);
        }
        setIsFormOpen(false);
      } else {
        const errorText = await response.text();
        console.error(`Failed to submit room: ${errorText}`);
      }
    } catch (error) {
      console.error("Failed to submit room:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4 px-4 border-b-2">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Rooms</h1>
        <button
          onClick={handleCreate}
          className="bg-black text-white px-4 py-2 rounded-full shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-white mb-6"
        >
          New Room Type
        </button>
      </div>

      <RoomTable rooms={rooms} onEdit={handleEdit} onDelete={(roomId) => setConfirmDelete(roomId)} />

      {isFormOpen && (
        <RoomForm
          room={editingRoom}
          onSubmit={handleFormSubmit}
          onClose={() => setIsFormOpen(false)}
        />
      )}

      {confirmDelete && (
        <ConfirmDialog
          isOpen={!!confirmDelete}
          message="Are you sure you want to delete this room?"
          onConfirm={() => {
            handleDelete(confirmDelete!);
            setConfirmDelete(null); // Close the dialog after confirmation
          }}
          onClose={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}
