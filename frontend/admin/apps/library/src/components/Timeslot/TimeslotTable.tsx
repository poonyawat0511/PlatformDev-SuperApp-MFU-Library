import { Timeslot } from "@/utils/TimeslotType";
import { BsTrashFill } from "react-icons/bs";
import { LiaPenFancySolid } from "react-icons/lia";

interface TimeslotTableProps {
  timeslots: Timeslot[];
  onEdit: (timeslot: Timeslot) => void;
  onDelete: (timeslotId: string) => void;
}

export default function TimeslotTable({
  timeslots,
  onEdit,
  onDelete,
}: TimeslotTableProps) {
  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            <th className="px-6 py-3 text-center">Start</th>
            <th className="px-6 py-3 text-center">End</th>
            <th className="px-6 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {timeslots.map((timeslot) => {
            const Start = timeslot.start || "No Data";
            const End = timeslot.end || "No Data";

            return (
              <tr key={timeslot.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-center">{Start}</td>
                <td className="px-6 py-4 text-center">{End}</td>
                <td className="px-6 py-4 flex space-x-2 text-center justify-center">
                  <button
                    onClick={() => onEdit(timeslot)}
                    className="bg-white text-black px-2 py-2 rounded-full border border-gray"
                  >
                    <LiaPenFancySolid className="size-5" />
                  </button>
                  <button
                    onClick={() => timeslot.id && onDelete(timeslot.id)}
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
