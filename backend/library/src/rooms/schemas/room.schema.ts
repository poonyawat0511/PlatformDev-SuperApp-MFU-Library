import { Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { RoomStatus, RoomType } from "../enums/room-status.enum";

export type RoomDocument = HydratedDocument<Room>;
@Schema()
export class Room {
  @Prop({ type: Number, required: true })
  room: number;

  @Prop(
    raw({
      th: { type: String, required: true },
      en: { type: String, required: true },
    })
  )
  detail: { th: string; en: string };

  @Prop({
    type: String,
    enum: ["READY", "NOT READY"],
    required: true,
  })
  status: RoomStatus;

  @Prop({
    type: String,
    enum: ["STUDY", "MEDIA"],
    required: true,
  })
  type: RoomType;
}
export const RoomSchema = SchemaFactory.createForClass(Room);
RoomSchema.index({ room: 1, type: 1 }, { unique: true });

RoomSchema.set("toJSON", { flattenObjectIds: true, versionKey: false });
RoomSchema.set("toObject", { flattenObjectIds: true, versionKey: false });
