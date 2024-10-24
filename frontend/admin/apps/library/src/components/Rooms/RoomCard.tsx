import { Room } from "@/utils/RoomTypes";
import { RoomType } from "@/utils/RoomtypeTypes";
import React, { useEffect, useState } from "react";

interface RoomFormProps {
  room?: Room | null;
  onSubmit: (data: Room) => void;
  onClose: () => void;
}

export default function RoomForm({ room, onSubmit, onClose }: RoomFormProps) {
  const [roomNumber, setRoomNumber] = useState<number>(0);
  const [floor, setFloor] = useState<number>(0);
  const [status, setStatus] = useState<string>("ready");
  const [type, setType] = useState<string>(""); // Changed to string to store MongoDB ID
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);

  useEffect(() => {
    if (room) {
      setRoomNumber(room.room);
      setFloor(room.floor);
      setStatus(room.status);
      setType(room.type.id); // Use ID as string
    }
  }, [room]);

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const response = await fetch("http://localhost:8082/api/room-types");
        const data = await response.json();
        setRoomTypes(data.data);
      } catch (error) {
        console.error("Error fetching room types:", error);
      }
    };

    fetchRoomTypes();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data: Room = {
      id: room?.id || "",
      room: roomNumber,
      floor,
      status,
      type:type,
    };

    console.log("Submitting room data:", data);
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {room ? "Edit Room" : "Create Room"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Room Number
            </label>
            <input
              type="number"
              value={roomNumber}
              onChange={(e) => setRoomNumber(Number(e.target.value))}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Floor
            </label>
            <input
              type="number"
              value={floor}
              onChange={(e) => setFloor(Number(e.target.value))}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="ready">Ready</option>
              <option value="not ready">Not Ready</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Room Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="" disabled>
                Select a room type
              </option>
              {roomTypes.map((roomType) => (
                <option key={roomType.id} value={roomType.id}>
                  {roomType.name.th} / {roomType.name.en}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              {room ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

