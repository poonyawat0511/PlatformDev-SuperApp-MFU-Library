import { Room } from "@/utils/RoomTypes";
import { BsTrashFill } from "react-icons/bs";
import { LiaPenFancySolid } from "react-icons/lia";

interface RoomTableProps {
  rooms: Room[];
  onEdit: (room: Room) => void;
  onDelete: (roomId: string) => void;
}

const RoomTable: React.FC<RoomTableProps> = ({ rooms, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            <th className="px-6 py-3 text-center">Room Number</th>
            <th className="px-6 py-3 text-center">Floor</th>
            <th className="px-6 py-3 text-center">Status</th>
            <th className="px-6 py-3 text-center">Room Type</th>
            <th className="px-6 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {rooms.length > 0 ? (
            rooms.map((room) => (
              <tr key={room.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-center">{room.room}</td>
                <td className="px-6 py-4 text-center">{room.floor}</td>
                <td className="px-6 py-4 text-center">{room.status}</td>
                <td className="px-6 py-4 text-center">
                  {/* Check if room.type is an object (RoomType) before accessing 'name' */}
                  {typeof room.type === "object" && room.type !== null ? (
                    room.type.name?.en || "Unknown Type"
                  ) : (
                    "Unknown Type"
                  )}
                </td>
                <td className="px-6 py-4 flex space-x-2 justify-center">
                  <button
                    onClick={() => onEdit(room)}
                    className="bg-white text-black px-2 py-2 rounded-full border border-gray-300 hover:bg-gray-200"
                  >
                    <LiaPenFancySolid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onDelete(room.id)}
                    className="bg-black text-white px-2 py-2 rounded-full border border-gray-300 hover:bg-gray-700"
                  >
                    <BsTrashFill className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center py-4">
                No rooms available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RoomTable;
