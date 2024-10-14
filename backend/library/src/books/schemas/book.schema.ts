import { Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes, Types } from "mongoose";
import { BookCategory } from "src/book-categories/schemas/book-category.schema";
import { BookStatus } from "../enums/book-status.enum";

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
      th: { type: String, required: true },
      en: { type: String, required: true },
    })
  )
  description: { th: string; en: string };

  @Prop({ type: String, required: true, unique: true })
  ISBN: string;

  @Prop({ type: String, required: false })
  bookImage: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: "BookCategory",
    required: true,
    default: () => null,
  })
  category: BookCategory | Types.ObjectId;

  @Prop({
    type: String,
    enum: ["ready", "not ready"],
    required: true,
  })
  status: BookStatus;

  @Prop({ type: Number, required: true, default: 0 ,min: 0 })
  quantity: number;

  _id: Types.ObjectId;
}
export const BookSchema = SchemaFactory.createForClass(Book);
BookSchema.set("toJSON", { flattenObjectIds: true, versionKey: false });
BookSchema.set("toObject", { flattenObjectIds: true, versionKey: false });
