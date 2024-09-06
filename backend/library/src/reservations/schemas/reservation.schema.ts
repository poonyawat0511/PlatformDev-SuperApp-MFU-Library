import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes, Types } from "mongoose";
import { Room } from "src/rooms/schemas/room.schema";
import { Timeslot } from "src/timeslots/schemas/timeslot.schema";
import { User } from "src/users/schemas/user.schema";
import { reservationType } from "../enums/reservation.enum";

export type ReservationDocument = HydratedDocument<Reservation>;
@Schema()
export class Reservation {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: "Room",
    required: true,
  })
  room: Room | Types.ObjectId;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: "User",
    required: true,
  })
  user: User | Types.ObjectId;

  @Prop({
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    required: true,
    default: "pending",
  })
  type: reservationType;

  @Prop({ type: Date, required: true, default: Date.now })
  dateTime?: Date;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: "Timeslot",
    required: true,
  })
  timeSlot?: Timeslot | Types.ObjectId;
}
export const ReservationSchema = SchemaFactory.createForClass(Reservation);
ReservationSchema.set("toJSON", { flattenObjectIds: true, versionKey: false });
ReservationSchema.set("toObject", {
  flattenObjectIds: true,
  versionKey: false,
});
