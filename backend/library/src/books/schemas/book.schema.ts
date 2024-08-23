import { Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type BookDocument = HydratedDocument<Book>;
@Schema()
export class Book {
  @Prop(
    raw({
      th: { type: String, required: true, unique: true },
      en: { type: String, required: true, unique: true },
    })
  )
  name: { th: string; en: string };

  @Prop(
    raw({
      th: { type: String, required: true, unique: true },
      en: { type: String, required: true, unique: true },
    })
  )
  description: { th: string; en: string };

  @Prop({ type: String, required: true })
  bookImage;

  @Prop(
    raw({
      th: { type: String, required: true, unique: true },
      en: { type: String, required: true, unique: true },
    })
  )
  type: { th: string; en: string };
  
  @Prop({ type: Number, required: true, default: 0 })
  quantity: number;
}
export const BookSchema = SchemaFactory.createForClass(Book);
BookSchema.set("toJSON", { flattenObjectIds: true, versionKey: false });
BookSchema.set("toObject", { flattenObjectIds: true, versionKey: false });
