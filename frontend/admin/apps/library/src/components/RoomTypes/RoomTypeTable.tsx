import { RoomType } from "../../utils/RoomtypeTypes";
import { BsTrashFill } from "react-icons/bs";
import { LiaPenFancySolid } from "react-icons/lia";

interface RoomTypeTableProps {
  roomTypes: RoomType[];
  onEdit: (roomType: RoomType) => void;
  onDelete: (roomTypeId: string) => void;
}

export default function RoomTypeTable({
  roomTypes,
  onEdit,
  onDelete,
}: RoomTypeTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            <th className="px-6 py-3 text-center">Room Type (EN)</th>
            <th className="px-6 py-3 text-center">Room Type (TH)</th>
            <th className="px-6 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {roomTypes.map((roomType) => (
            <tr key={roomType.id} className="border-b hover:bg-gray-50">
              <td className="px-6 py-4 text-center">{roomType.name.en}</td>
              <td className="px-6 py-4 text-center">{roomType.name.th}</td>
              <td className="px-6 py-4 flex space-x-2 justify-center">
                <button
                  onClick={() => onEdit(roomType)}
                  className="bg-white text-black px-2 py-2 rounded-full border border-gray-300 hover:bg-gray-200"
                >
                  <LiaPenFancySolid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onDelete(roomType.id)}  // Pass the roomTypeId to the onDelete prop
                  className="bg-black text-white px-2 py-2 rounded-full border border-gray-300 hover:bg-gray-700"
                >
                  <BsTrashFill className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
