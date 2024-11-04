import { Reservation } from "@/utils/ReservationType";
import { BsTrashFill } from "react-icons/bs";
import { FaTimes } from "react-icons/fa";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { LiaPenFancySolid } from "react-icons/lia";

interface ReservationTableProps {
  reservations: Reservation[];
  onEdit: (reservations: Reservation) => void;
  onDelete: (reservationsId: string) => void;
  onUpdateType: (ReservationId: string ,type:string) => void;
}

export default function ReservationTable({
  reservations,
  onEdit,
  onDelete,
  onUpdateType,
}: ReservationTableProps) {
  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            <th className="px-6 py-3 text-center">Room</th>
            <th className="px-6 py-3 text-center">User</th>
            <th className="px-6 py-3 text-center">Type</th>
            <th className="px-6 py-3 text-center">TimeStart</th>
            <th className="px-6 py-3 text-center">TimeEnd</th>
            <th className="px-6 py-3 text-center">Date</th>
            <th className="px-6 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {reservations.map((reservation) => {
            return (
              <tr key={reservation.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-center">
                  {reservation.room?.room || "-"}
                </td>
                <td className="px-6 py-4 text-center">
                  {reservation.user?.username}
                </td>
                <td className="px-6 py-4 capitalize text-center">
                  {reservation.type || "-"}
                </td>
                <td className="px-6 py-4 capitalize text-center">
                  {reservation.timeSlot?.start || "-"}
                </td>
                <td className="px-6 py-4 capitalize text-center">
                  {reservation.timeSlot?.end || "-"}
                </td>
                <td className="px-6 py-4 text-center">
                  {reservation.dateTime
                    ? new Date(reservation.dateTime).toLocaleDateString()
                    : "-"}
                </td>
                <td className="px-6 py-4 flex space-x-2 text-center justify-center">
                  <button
                    onClick={() => onEdit(reservation)}
                    className="bg-white text-black px-2 py-2 rounded-full border border-gray"
                  >
                    <LiaPenFancySolid className="size-5" />
                  </button>
                  <button
                    onClick={() => reservation.id && onDelete(reservation.id)}
                    className="bg-black text-white px-2 py-2 rounded-full border border-gray"
                  >
                    <BsTrashFill className="size-5" />
                  </button>
                  <button
                    onClick={() =>  reservation.id && onUpdateType(reservation.id, "confirmed")}
                    style={{ backgroundColor: "#6DDABE", color: "white" }}
                    className="px-2 py-2 rounded-full border border-gray"
                  >
                    <IoMdCheckmarkCircleOutline className="size-5" />
                  </button>

                  <button
                    onClick={() => reservation.id &&  onUpdateType(reservation.id, "cancelled")}
                    style={{ backgroundColor: "#EF5A6F", color: "white" }}
                    className="px-2 py-2 rounded-full border border-gray"
                  >
                    <FaTimes className="size-5" />
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
