import { RoomType } from "@/utils/RoomtypeTypes";
interface RoomTypeProps {
  roomType: RoomType;
  onEdit: (roomType: RoomType) => void;
  onDelete: (roomTypeId: string) => void;
}
export default function RoomTypeTable({
  roomType,
  onEdit,
  onDelete,
}: RoomTypeProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            <th className="px-6 py-3 text-left">TH</th>
            <th className="px-6 py-3 text-left">EN</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          <tr className="border-b hover:bg-gray-50">
            <td className="px-6 py-4">{roomType.name.th}</td>
            <td className="px-6 py-4">{roomType.name.en}</td>
            <td className="px-6 py-4 flex space-x-2">
              <button
                onClick={() => onEdit(roomType)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(roomType.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
