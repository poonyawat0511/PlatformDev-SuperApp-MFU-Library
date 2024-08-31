import { Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type RoomTypeDocument = HydratedDocument<RoomType>;
@Schema()
export class RoomType {
  @Prop(
    raw({
      th: { type: String, required: true, unique: true },
      en: { type: String, required: true, unique: true },
    })
  )
  name: { th: string; en: string };
}
export const RoomTypeSchema = SchemaFactory.createForClass(RoomType);
RoomTypeSchema.set("toJSON", { flattenObjectIds: true, versionKey: false });
RoomTypeSchema.set("toObject", { flattenObjectIds: true, versionKey: false });
