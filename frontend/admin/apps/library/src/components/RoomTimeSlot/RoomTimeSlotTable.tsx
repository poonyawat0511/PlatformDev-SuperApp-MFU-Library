import { RoomTimeSlot } from "@/utils/RoomTimeSlot";
import { Room } from "@/utils/RoomTypes";
import { Timeslot } from "@/utils/TimeslotType";

interface RoomTimeSlotTableProps {
  roomTimeSlots: RoomTimeSlot[];
  rooms: Room[];
  timeSlots: Timeslot[];
  onEdit: (roomTimeSlots: RoomTimeSlot) => void;
  onDelete: (roomTimeSlotsId: string) => void;
}

export default function RoomTimeSlotTable({
  roomTimeSlots,
  rooms,
  timeSlots,
  onEdit,
  onDelete,
}: RoomTimeSlotTableProps) {
  // Group roomTimeSlots by room for easy access
  const roomTimeSlotMap = roomTimeSlots.reduce((acc, slot) => {
    const roomId = slot.room.id;
    if (!acc[roomId]) {
      acc[roomId] = [];
    }
    acc[roomId].push(slot);
    return acc;
  }, {} as Record<string, RoomTimeSlot[]>);

  // Sort rooms by room number (room.room is already a number)
  const sortedRooms = [...rooms].sort((a, b) => a.room - b.room);

  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            <th className="px-6 py-3 text-center">Room/Time</th>
            {/* Generate a column for each time slot from the timeSlots prop */}
            {timeSlots.map((timeSlot, index) => (
              <th key={index} className="px-6 py-3 text-center">
                {`${timeSlot.start} - ${timeSlot.end}`}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {/* Render sorted rooms and their corresponding time slots */}
          {sortedRooms.map((room) => {
            const slots = roomTimeSlotMap[room.id] || [];
            return (
              <tr key={room.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 capitalize text-center">
                  {room.type?.name?.en || "-"} {room.room || "-"}
                </td>
                {timeSlots.map((timeSlot) => {
                  // Check if there's a matching RoomTimeSlot for the current time slot
                  const currentSlot = slots.find(
                    (slot) =>
                      slot.timeSlot?.start === timeSlot.start &&
                      slot.timeSlot?.end === timeSlot.end
                  );
                  return (
                    <td
                      key={timeSlot.start + timeSlot.end}
                      className="px-6 py-4 capitalize text-center cursor-pointer hover:bg-gray-200"
                      onClick={() => {
                        if (currentSlot) {
                          // Open dialog for editing
                          onEdit(currentSlot);
                        }
                      }}
                    >
                      {currentSlot?.status || "-"}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
