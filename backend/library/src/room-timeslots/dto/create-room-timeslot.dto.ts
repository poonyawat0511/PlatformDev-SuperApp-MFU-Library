import { IsIn, IsNotEmpty, IsString } from "class-validator";
import { RoomTimeSlotStatus } from "../enums/room-timeslot.enum";

export class CreateRoomTimeslotDto {
  @IsNotEmpty()
  room: string;

  @IsNotEmpty()
  timeSlot: string;

  @IsString()
  @IsIn([RoomTimeSlotStatus.free, RoomTimeSlotStatus.reserved, RoomTimeSlotStatus.in_use])
  status: RoomTimeSlotStatus;
}
