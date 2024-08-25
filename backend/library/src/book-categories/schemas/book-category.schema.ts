import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BookCategoryDocument = HydratedDocument<BookCategory>;
@Schema()
export class BookCategory {
  @Prop(
    raw({
      th: { type: String, required: true, unique: true },
      en: { type: String, required: true, unique: true },
    }),
  )
  name: { th: string; en: string };
}
export const BookCategorySchema = SchemaFactory.createForClass(BookCategory);
BookCategorySchema.set('toJSON', { flattenObjectIds: true, versionKey: false });
BookCategorySchema.set('toObject', { flattenObjectIds: true, versionKey: false });