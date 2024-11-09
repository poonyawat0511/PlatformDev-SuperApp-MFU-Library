import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes, Types } from "mongoose";
import { Room } from "src/rooms/schemas/room.schema";
import { Timeslot } from "src/timeslots/schemas/timeslot.schema";
import { RoomTimeSlotStatus } from "../enums/room-timeslot.enum";

export type RoomTimeSlotDocument = HydratedDocument<RoomTimeSlot>;
@Schema()
export class RoomTimeSlot {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: "Room",
    required: true,
    default: () => null,
  })
  room: Room | Types.ObjectId;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: "Timeslot",
    required: true,
    default: () => null,
  })
  timeSlot: Timeslot | Types.ObjectId;

  @Prop({ type: String, enum: ["free", "reserved", "in use"], required: true })
  status: RoomTimeSlotStatus;
}

export const RoomTimeSlotSchema = SchemaFactory.createForClass(RoomTimeSlot);
RoomTimeSlotSchema.index({ room: 1, timeSlot: 1 }, { unique: true });

RoomTimeSlotSchema.set("toJSON", { flattenObjectIds: true, versionKey: false });
RoomTimeSlotSchema.set("toObject", {
  flattenObjectIds: true,
  versionKey: false,
});
