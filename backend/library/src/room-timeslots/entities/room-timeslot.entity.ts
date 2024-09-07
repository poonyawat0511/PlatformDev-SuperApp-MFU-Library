import { Types } from "mongoose";
import { MongoEntity } from "src/app/common/lib/mongo.entiy";
import { TransformId } from "src/app/decorator/transform-id.decorator";
import { RoomEntity } from "src/rooms/entities/room.entity";
import { Room } from "src/rooms/schemas/room.schema";
import { TimeslotEntity } from "src/timeslots/entities/timeslot.entity";
import { Timeslot } from "src/timeslots/schemas/timeslot.schema";
import { RoomTimeSlotStatus } from "../enums/room-timeslot.enum";

export class RoomTimeSlotEntity extends MongoEntity {
  @TransformId((v) => new RoomEntity(v))
  room?: Types.ObjectId | Room | null;

  @TransformId((v) => new TimeslotEntity(v))
  timeSlot?: Types.ObjectId | Timeslot | null;

  status: RoomTimeSlotStatus;
  constructor(partial: Partial<RoomTimeSlotEntity>) {
    super();
    Object.assign(this, partial);
  }
}
