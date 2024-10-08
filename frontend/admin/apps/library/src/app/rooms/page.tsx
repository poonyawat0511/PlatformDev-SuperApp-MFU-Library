"use client";
import { useEffect, useState } from "react";
import RoomForm from "../../components/Rooms/RoomForm";
import { Room } from "../components/Types/RoomTypes";

export default function RoomPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await fetch("http://localhost:8082/api/rooms");
      const data = await response.json();
      setRooms(data.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const handleCreate = () => {
    setSelectedRoom(null);
    setIsFormOpen(true);
  };

  const handleEdit = (room: Room) => {
    setSelectedRoom(room);
    setIsFormOpen(true);
  };

  const handleDelete = async (roomId: string) => {
    try {
      await fetch(`http://localhost:8082/api/rooms/${roomId}`, {
        method: "DELETE",
      });
      fetchRooms();
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  };

  const handleSubmit = async (data: Room) => {
    try {
      const method = data.id ? "PATCH" : "POST";
      const endpoint = data.id
        ? `http://localhost:8082/api/rooms/${data.id}`
        : "http://localhost:8082/api/rooms";

      await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      fetchRooms(); // Refresh the room list after submission
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error submitting room data:", error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Room Management</h1>
      <button
        onClick={handleCreate}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Create New Room
      </button>
      <ul>
        {rooms.map((room) => (
          <li key={room.id} className="mb-2 flex justify-between items-center">
            <div>
              Room {room.room}, Floor {room.floor} - {room.status} (
              {room.type.name.en})
            </div>
            <div>
              <button
                onClick={() => handleEdit(room)}
                className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(room.id)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      {isFormOpen && (
        <RoomForm
          room={selectedRoom}
          onSubmit={handleSubmit}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}
