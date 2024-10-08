import { Room } from "@/utils/RoomTypes";
import React from "react";

interface RoomCardProps {
  room: Room;
  onEdit: (room: Room) => void;
  onDelete: (roomId: string) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onEdit, onDelete }) => {
  const roomTypeName = room.type?.name?.en || "Unknown Type";

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden shadow-lg mb-4">
      <div className="bg-gray-200 p-4">
        <h2 className="text-xl font-bold text-gray-800">Room {room.room}</h2>
      </div>
      <div className="p-4">
        <table className="w-full text-left">
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="py-2 font-semibold text-gray-700">Floor:</td>
              <td className="py-2">{room.floor}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-2 font-semibold text-gray-700">Status:</td>
              <td className="py-2">{room.status}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-2 font-semibold text-gray-700">Type:</td>
              <td className="py-2">{roomTypeName}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="bg-gray-100 p-4 flex justify-end space-x-2">
        <button
          onClick={() => onEdit(room)}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(room.id)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default RoomCard;
