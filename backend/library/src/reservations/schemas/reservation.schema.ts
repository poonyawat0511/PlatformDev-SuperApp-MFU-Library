import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes, Types } from "mongoose";
import { Room } from "src/rooms/schemas/room.schema";
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
    enum: ["reserve", "return","in use"],
    required: true,
  })
  type: reservationType;

  @Prop({ type: Date, required: true })
  dueTime?: Date;

  @Prop({ type: Date, default: Date.now })
  reserveTime?: Date;

  @Prop({ type: Date, default: () => null })
  returnTime?: Date;
}
export const ReservationSchema = SchemaFactory.createForClass(Reservation);
ReservationSchema.set("toJSON", { flattenObjectIds: true, versionKey: false });
ReservationSchema.set("toObject", {
  flattenObjectIds: true,
  versionKey: false,
});
