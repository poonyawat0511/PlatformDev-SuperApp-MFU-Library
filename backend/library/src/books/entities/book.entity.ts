import { MongoEntity } from "src/app/common/lib/mongo.entiy";
import { TransformUrl } from "src/app/decorator/transform-url.decorator";
import { BookStatus } from "../enums/book-status.enum";
import { Types } from "mongoose";
import { BookCategory } from "src/book-categories/schemas/book-category.schema";
import { TransformId } from "src/app/decorator/transform-id.decorator";
import { BookCategoryEntity } from "src/book-categories/entities/book-category.entity";

export class BookEntity extends MongoEntity {
  name: { th: string; en: string };

  description: { th: string; en: string };

  @TransformUrl({ type: "string" })
  bookImage: string;

  @TransformId((v) => new BookCategoryEntity(v))
  category?: Types.ObjectId | BookCategory | null;

  status: BookStatus;

  constructor(partial: Partial<BookEntity>) {
    super();
    Object.assign(this, partial);
  }
}
