import { Room } from "@/utils/RoomTypes";
import { BsTrashFill } from "react-icons/bs";
import { LiaPenFancySolid } from "react-icons/lia";

interface RoomTableProps {
  rooms: Room[];
  onEdit: (rooms: Room) => void;
  onDelete: (roomsId: string) => void;
}

export default function RoomTable({
  rooms,
  onEdit,
  onDelete,
}: RoomTableProps) {
  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            <th className="px-6 py-3 text-center">Room</th>
            <th className="px-6 py-3 text-center">Floor</th>
            <th className="px-6 py-3 text-center">Status</th>
            <th className="px-6 py-3 text-center">Type EN</th>
            <th className="px-6 py-3 text-center">Type TH</th>
            <th className="px-6 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {rooms.map((room) => {
            return (
              <tr key={room.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-center">
                  {room.room}
                </td>
                <td className="px-6 py-4 text-center">
                  {room.floor}
                </td>
                <td className="px-6 py-4 capitalize text-center">
                  {room.status || "-"}
                </td>
                <td className="px-6 py-4 capitalize text-center">
                  {room.type?.name?.en|| "-"}
                </td>
                <td className="px-6 py-4 capitalize text-center">
                  {room.type?.name?.th|| "-"}
                </td>
                <td className="px-6 py-4 flex space-x-2 text-center justify-center">
                  <button
                    onClick={() => onEdit(room)}
                    className="bg-white text-black px-2 py-2 rounded-full border border-gray"
                  >
                    <LiaPenFancySolid className="size-5" />
                  </button>
                  <button
                    onClick={() => room.id && onDelete(room.id)}
                    className="bg-black text-white px-2 py-2 rounded-full border border-gray"
                  >
                    <BsTrashFill className="size-5" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
