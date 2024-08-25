import { MongoEntity } from "src/app/common/lib/mongo.entiy";

export class BookCategoryEntity extends MongoEntity {
  name: { th: string; en: string };

  constructor(partial: Partial<BookCategoryEntity>) {
    super();
    Object.assign(this, partial);
  }
}
