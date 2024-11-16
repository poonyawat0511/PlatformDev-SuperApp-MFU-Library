import { Rooms } from "./rooms";
import { TimeSlots } from "./timeslots";

export interface RoomTimeSlots {
  room: Rooms;
  timeSlot: TimeSlots;
  status: "free" | "reserved" | "in use";
}
