import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes, Types } from "mongoose";
import { RoomType } from "src/room-types/schemas/room-type.schema";
import { RoomStatus } from "../enums/room-status.enum";

export type RoomDocument = HydratedDocument<Room>;
@Schema()
export class Room {
  @Prop({ type: Number, required: true })
  room: number;

  @Prop({ type: Number, required: true })
  floor: number;

  @Prop({
    type: String,
    enum: ["ready", "not ready"],
    required: true,
  })
  status: RoomStatus;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: "RoomType",
    required: true,
  })
  type: RoomType | Types.ObjectId;
}
export const RoomSchema = SchemaFactory.createForClass(Room);
RoomSchema.index({ room: 1, floor: 1 }, { unique: true });

RoomSchema.set("toJSON", { flattenObjectIds: true, versionKey: false });
RoomSchema.set("toObject", { flattenObjectIds: true, versionKey: false });
